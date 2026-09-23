-- InnoTech-Hub Admin Console — Phase 4 schema
-- (Ticket tiers / "Passes" for events — Early Bird, Standard, VIP, etc.)
-- Run in Supabase SQL Editor AFTER schema.sql, schema-phase2.sql and schema-phase3.sql.
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- event_passes
-- Optional named ticket tiers for an event (e.g. "Early Bird", "Standard",
-- "VIP", or a single "General Entry" pass for podcasts/carnivals). An event
-- with no rows here just uses the existing flat events.payment_required /
-- payment_amount fields — passes are additive, not a replacement.
-- ---------------------------------------------------------------------------
create table if not exists public.event_passes (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  name         text not null,
  description  text,
  price        numeric not null default 0,
  capacity     integer,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists event_passes_event_id_idx on public.event_passes (event_id);

-- ---------------------------------------------------------------------------
-- Link a registration to the pass the student picked (nullable — only set
-- for events that use the passes model).
-- ---------------------------------------------------------------------------
alter table public.event_registrations
  add column if not exists pass_id uuid references public.event_passes(id) on delete set null;

create index if not exists event_registrations_pass_id_idx on public.event_registrations (pass_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — same shape as public.events: admin mutations go
-- through /api/admin/** with the service role (bypasses RLS); this policy
-- only governs direct anon/public reads (the public event browse/detail
-- pages) so pass options are visible for published events.
-- ---------------------------------------------------------------------------
alter table public.event_passes enable row level security;

drop policy if exists "Public can read passes for published events" on public.event_passes;
create policy "Public can read passes for published events"
  on public.event_passes for select
  using (event_id in (select id from public.events where status = 'published'));
