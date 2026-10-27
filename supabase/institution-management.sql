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
