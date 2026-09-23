-- InnoTech-Hub Admin Console — Phase 5 schema
-- (Student Dashboard V2: Projects, certificate skill tagging, public profiles)
-- Run in Supabase SQL Editor AFTER schema.sql, schema-phase2.sql, schema-phase3.sql, schema-phase4.sql.
-- Safe to re-run: every statement is idempotent.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- projects — the student's own project portfolio, tracked through a simple
-- 4-stage pipeline (ideation -> team_formation -> github_linked -> submitted).
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  event_id       uuid references public.events(id) on delete set null,
  title          text not null,
  description    text,
  stage          text not null default 'ideation'
                 check (stage in ('ideation', 'team_formation', 'github_linked', 'submitted')),
  team_members   text[] not null default '{}',
  github_url     text,
  live_url       text,
  skills         text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects (user_id);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- certificates.skills — optional skill tags an admin can attach when issuing
-- a certificate, so the student's public profile has real data to visualize
-- in the skills radar chart.
-- ---------------------------------------------------------------------------
alter table public.certificates
  add column if not exists skills text[] not null default '{}';

-- ---------------------------------------------------------------------------
-- users.profile_public — opt-in flag for the shareable Innovator Profile
-- page (/u/:id). Defaults to false — a student must explicitly turn it on.
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists profile_public boolean not null default false;

-- ---------------------------------------------------------------------------
-- Row Level Security — same shape as prior phases: all mutations go through
-- /api/** with the service role (bypasses RLS). These policies only govern
-- direct anon/public reads.
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
-- No public policy on projects — they're never shown on the public profile
-- in this phase, only ever read/written via /api/student/** for their owner.
