-- InnoTech-Hub Admin Console — Phase 1 schema (Event Management)
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: every statement is idempotent.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  slug                    text not null unique,
  category                text,
  description             text,
  status                  text not null default 'draft'
                          check (status in ('draft', 'published', 'completed')),

  start_date              timestamptz,
  end_date                timestamptz,
  registration_deadline   timestamptz,

  venue_type              text check (venue_type in ('online', 'offline', 'hybrid')),
  venue_address           text,
  venue_link              text,

  banner_url              text,
  gallery_urls            text[] not null default '{}',

  rules_text              text,
  rules_doc_url           text,

  prize_pool              numeric,
  prize_details           text,

  payment_required        boolean not null default false,
  payment_amount          numeric,
  payment_instructions    text,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists events_status_idx on public.events (status);
create index if not exists events_start_date_idx on public.events (start_date);

-- keep updated_at fresh on every UPDATE
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- event_registrations
-- Populated by the (future) public registration flow. Referenced now so the
-- Event Master List can show a real "Total Registered" count and CSV export
-- has somewhere to read from as soon as registrations exist.
-- ---------------------------------------------------------------------------
create table if not exists public.event_registrations (
  id                 uuid primary key default gen_random_uuid(),
  event_id           uuid not null references public.events(id) on delete cascade,

  student_name       text,
  student_email      text,
  student_phone      text,
  college            text,
  team_name          text,

  payment_status     text not null default 'not_required'
                      check (payment_status in ('not_required', 'pending', 'submitted', 'approved', 'rejected')),
  payment_proof_url  text,

  registered_at      timestamptz not null default now()
);

create index if not exists event_registrations_event_id_idx on public.event_registrations (event_id);
create index if not exists event_registrations_payment_status_idx on public.event_registrations (payment_status);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- All admin mutations go through /api/admin/** using the Supabase
-- SERVICE ROLE key, which bypasses RLS entirely — these policies only
-- govern what an anonymous/public client (the anon key, e.g. the future
-- public event pages) is allowed to read directly.
-- ---------------------------------------------------------------------------
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
  on public.events for select
  using (status = 'published');

-- No public policies on event_registrations — registration data is only
-- ever read/written via the service-role API.

-- ---------------------------------------------------------------------------
-- Storage buckets for event media (banners/gallery) and documents (rules,
-- prize sheets). Uploaded via /api/admin/upload using the service role key;
-- public bucket so the resulting URLs render directly on the site.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-media', 'event-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('event-docs', 'event-docs', true)
on conflict (id) do nothing;

drop policy if exists "Public read event-media" on storage.objects;
create policy "Public read event-media"
  on storage.objects for select
  using (bucket_id = 'event-media');

drop policy if exists "Public read event-docs" on storage.objects;
create policy "Public read event-docs"
  on storage.objects for select
  using (bucket_id = 'event-docs');
