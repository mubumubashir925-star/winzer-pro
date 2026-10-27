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
