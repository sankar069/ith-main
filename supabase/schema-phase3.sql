-- InnoTech-Hub Admin Console — Phase 3 schema
-- (Real student authentication + Student Dashboard data)
-- Run in Supabase SQL Editor AFTER schema.sql and schema-phase2.sql.
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- Link public.users to Supabase Auth. Students sign up/log in via Supabase
-- Auth (auth.users); this column ties that identity to their profile row in
-- public.users, which the admin console already reads/writes.
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists auth_user_id uuid unique references auth.users(id) on delete cascade;

-- Auto-provision a public.users profile row the moment someone signs up via
-- Supabase Auth, so the student dashboard always has a profile to read.
create or replace function public.handle_new_student()
returns trigger as $$
begin
  insert into public.users (auth_user_id, full_name, email, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'active'
  )
  on conflict (email) do update set auth_user_id = excluded.auth_user_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_student();

-- ---------------------------------------------------------------------------
-- Link registrations to a real student account (nullable — the public
-- registration flow that would set this doesn't exist yet).
-- ---------------------------------------------------------------------------
alter table public.event_registrations
  add column if not exists user_id uuid references public.users(id) on delete set null;

create index if not exists event_registrations_user_id_idx on public.event_registrations (user_id);

-- ---------------------------------------------------------------------------
-- certificates — backs both the Student Dashboard's Certificate Vault and
-- the (future) admin Certificate Issuer tab in the Event Workspace.
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  event_id          uuid references public.events(id) on delete set null,
  title             text not null,
  issuer            text,
  certificate_url   text,
  status            text not null default 'pending'
                    check (status in ('earned', 'in_progress', 'pending')),
  earned_date       date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists certificates_user_id_idx on public.certificates (user_id);

drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at
  before update on public.certificates
  for each row execute function public.set_updated_at();

-- RLS stays service-role-only, same as public.users — the student dashboard
-- reads/writes through /api/student/** (service role, scoped server-side to
-- the authenticated user's own row), never directly against these tables.
alter table public.certificates enable row level security;
