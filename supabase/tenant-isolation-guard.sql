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
