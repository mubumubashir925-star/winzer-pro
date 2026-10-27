-- WINZERA PRO - CONSOLIDATED DATABASE UPGRADE (2026-10-27)
-- For an EXISTING Supabase project with the core schema already installed.
-- Includes all four current SQL migrations in supabase/.
-- Safe to rerun at the DDL/data level: IF NOT EXISTS, ON CONFLICT, replaceable functions,
-- and DROP/CREATE for ONLY the named policies/triggers.
-- No DROP TABLE, TRUNCATE, DELETE FROM application data, or password changes.
--
-- IMPORTANT: TAKE A DATABASE BACKUP BEFORE RUNNING.
-- IMPORTANT: RLS guard is a security policy change; review permissions and
-- test Super Admin, Institution Admin, Judge, Team Manager, public access afterward.
-- This does NOT deploy the institution-admin Edge Function.
-- This does NOT include the original base schema or grant public read access.
-- Execute as a single script in Supabase SQL Editor, on the intended project.
-- On failure, the transaction rolls back. Do not ignore SQL errors.
BEGIN;

-- Fail early if the foundational schema is absent.
DO $$
BEGIN
  IF to_regclass('public.organizations') IS NULL OR
     to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION 'Winzera core tables missing: install the base schema first. No changes applied.';
  END IF;
END $$;

-- PART 1 / 4: Institution management metadata
-- Run once in Supabase SQL Editor BEFORE deploying the Edge Function.
-- Admin usernames are metadata only. Password hashes live in Supabase Auth, never this table.
create table if not exists public.institution_management (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  admin_user_id uuid unique not null references auth.users(id) on delete cascade,
  admin_username text not null,
  plan text not null default 'standard',
  paid_until date,
  participant_limit integer not null default 0 check (participant_limit >= 0),
  contact text,
  notes text,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.institution_management enable row level security;
-- Deliberately no client policies: the protected Edge Function uses service role.
create unique index if not exists institution_management_username_unique on public.institution_management (org_id, lower(admin_username));

-- PART 2 / 4: Non-destructive legacy backfill
-- Backfill management metadata for institutions created before the new dashboard.
-- Non-destructive: does not delete organizations, users, or competition data.
-- Only migrate institutions with an existing admin profile; unmatched institutions are skipped.
-- Do not create fake auth users or remove NOT NULL constraints.
INSERT INTO public.institution_management
  (org_id, admin_user_id, admin_username, plan, participant_limit, suspended)
SELECT o.id,
       u.id,
       'legacy-admin',
       'legacy',
       0,
       false
FROM public.organizations o
JOIN LATERAL (
  SELECT id FROM public.users
  WHERE org_id = o.id AND role = 'admin'
  ORDER BY id LIMIT 1
) u ON true
WHERE NOT EXISTS (
  SELECT 1 FROM public.institution_management m WHERE m.org_id = o.id
)
ON CONFLICT (org_id) DO NOTHING;
-- Inspect results. Do not reset passwords for rows without admin_user_id.
SELECT o.name, o.slug, m.org_id, m.admin_user_id, m.admin_username
FROM public.organizations o
LEFT JOIN public.institution_management m ON m.org_id = o.id
ORDER BY o.name;

-- PART 3 / 4: Restrictive tenant isolation policy
-- Winzera Pro tenant isolation guard for authenticated users.
-- Run in Supabase SQL Editor after reviewing existing RLS policies.
-- Restrictive policies are combined with existing permissive policies (AND), so
-- this DOES NOT grant access. It prevents signed-in admins from accessing
-- another organization's rows even if an older permissive policy is too broad.
-- Anonymous public viewing remains governed by existing public/broadcast RLS.
-- IMPORTANT: Check the app's public viewer behavior for authenticated sessions.
create or replace function public.winzera_current_org_id()
returns uuid language sql stable security definer
set search_path = public
as $$
  select org_id from public.users where id = (select auth.uid()) limit 1
$$;
revoke all on function public.winzera_current_org_id() from public;
grant execute on function public.winzera_current_org_id() to authenticated;
create or replace function public.winzera_is_super_admin()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists(select 1 from public.users where id = (select auth.uid()) and role = 'super_admin')
$$;
revoke all on function public.winzera_is_super_admin() from public;
grant execute on function public.winzera_is_super_admin() to authenticated;
do $$
declare t text;
begin
 foreach t in array array['teams','sections','items','participants','groups','marks','bonuses','item_assignments','org_config','judge_links','team_auth_links','team_sessions','broadcast_links'] loop
   if exists(select 1 from information_schema.columns where table_schema='public' and table_name=t and column_name='org_id') then
     execute format('alter table public.%I enable row level security',t);
     execute format('drop policy if exists winzera_tenant_guard on public.%I',t);
     execute format('create policy winzera_tenant_guard on public.%I as restrictive for all to authenticated using (org_id = (select public.winzera_current_org_id()) or (select public.winzera_is_super_admin())) with check (org_id = (select public.winzera_current_org_id()) or (select public.winzera_is_super_admin()))',t);
   end if;
 end loop;
end $$;
-- Verify tenant columns, existing policies and role grants after migration.
select schemaname,tablename,policyname,permissive,roles,cmd
from pg_policies where schemaname='public' order by tablename,policyname;

-- PART 4 / 4: Data revision tracking
-- Winzera Pro revision markers for local-first clients.
-- MANUAL DEPLOYMENT: run in Supabase SQL Editor after reviewing current RLS.
-- Does not grant access or change existing policies.
alter table public.organizations
  add column if not exists data_revision bigint not null default 0;

create or replace function public.wz_bump_org_revision()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
declare affected_org uuid;
begin
  if TG_OP = 'DELETE' then affected_org := OLD.org_id;
  else affected_org := NEW.org_id;
  end if;
  if affected_org is not null then
    update public.organizations
       set data_revision = data_revision + 1
     where id = affected_org;
  end if;
  if TG_OP = 'DELETE' then return OLD; end if;
  return NEW;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'teams','sections','items','participants','item_assignments',
    'marks','groups','bonuses'
  ] loop
    if to_regclass('public.'||table_name) is not null then
      execute format('drop trigger if exists wz_revision_%I on public.%I',table_name,table_name);
      execute format('create trigger wz_revision_%I after insert or update or delete on public.%I for each row execute function public.wz_bump_org_revision()',table_name,table_name);
    end if;
  end loop;
end $$;

-- Settings live on organizations itself. Avoid recursion: BEFORE trigger modifies NEW.
create or replace function public.wz_bump_settings_revision()
returns trigger language plpgsql as $$
begin
  if NEW.settings is distinct from OLD.settings then
    NEW.data_revision := greatest(NEW.data_revision,OLD.data_revision)+1;
  end if;
  return NEW;
end;
$$;
drop trigger if exists wz_revision_settings on public.organizations;
create trigger wz_revision_settings before update of settings on public.organizations
for each row execute function public.wz_bump_settings_revision();

-- RLS must continue to limit SELECT of data_revision to the right institution.
-- Verify each referenced table has org_id, and that the above triggers deployed.


-- Legacy group-result support: group chest numbers are not participant IDs.
-- Keep their score rows in a JSONB column on the group itself.
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS result_marks jsonb NOT NULL DEFAULT '[]'::jsonb;
COMMIT;

-- After execution, verify policies, organizations and revision triggers.
