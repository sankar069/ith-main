-- InnoTech-Hub Admin Console — Phase 2 schema
-- (Student & User Management, Content & CMS, Admin Settings)
-- Run in Supabase SQL Editor AFTER supabase/schema.sql.
-- Safe to re-run: every statement is idempotent.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- admins — replaces the single hardcoded credential with a real table.
-- The originally-seeded super admin has no password_hash yet, so login falls
-- back to the legacy hardcoded/env credential (ithadmin@ith.com / admin@2026)
-- until a real password is set via Settings -> Change Password, at which
-- point the hash in this table becomes authoritative. Sub-admins invited via
-- Settings -> Team start with status 'invited' and no password — they can't
-- log in yet (there's no invite-accept/email flow), the roster just tracks
-- who has been granted access so far.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  display_name   text,
  avatar_url     text,
  role           text not null default 'event_manager'
                 check (role in ('super_admin', 'event_manager')),
  status         text not null default 'invited'
                 check (status in ('active', 'invited')),
  password_hash  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists admins_set_updated_at on public.admins;
create trigger admins_set_updated_at
  before update on public.admins
  for each row execute function public.set_updated_at();

insert into public.admins (email, display_name, role, status)
values ('ithadmin@ith.com', 'InnoTech Admin', 'super_admin', 'active')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- users — the platform's registered students (global directory).
-- The public sign-up flow doesn't persist here yet, so a handful of sample
-- rows are seeded below purely so the admin table isn't empty on first load.
-- Safe to delete the sample rows once real signups exist.
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  email             text not null unique,
  phone             text,
  college           text,
  graduation_year   int,
  status            text not null default 'active'
                     check (status in ('active', 'deactivated', 'banned')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists users_status_idx on public.users (status);
create index if not exists users_college_idx on public.users (college);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

insert into public.users (full_name, email, college, graduation_year, phone, status)
values
  ('Aisha Rao', 'aisha.rao@example.edu', 'St. Peter''s Engineering College', 2026, '+91 90000 00001', 'active'),
  ('Rohit Menon', 'rohit.menon@example.edu', 'St. Peter''s Engineering College', 2025, '+91 90000 00002', 'active'),
  ('Sneha Kulkarni', 'sneha.k@example.edu', 'VNR VJIET', 2027, '+91 90000 00003', 'active'),
  ('Arjun Verma', 'arjun.verma@example.edu', 'VNR VJIET', 2026, '+91 90000 00004', 'deactivated'),
  ('Priya Nair', 'priya.nair@example.edu', 'CBIT Hyderabad', 2025, '+91 90000 00005', 'active'),
  ('Kabir Singh', 'kabir.singh@example.edu', 'CBIT Hyderabad', 2026, '+91 90000 00006', 'banned'),
  ('Meera Iyer', 'meera.iyer@example.edu', 'MVSR Engineering College', 2027, '+91 90000 00007', 'active'),
  ('Dev Patel', 'dev.patel@example.edu', 'MVSR Engineering College', 2026, '+91 90000 00008', 'active')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- sponsors — Partners & Sponsors CMS.
-- ---------------------------------------------------------------------------
create table if not exists public.sponsors (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  logo_url      text,
  website_link  text,
  category      text,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists sponsors_sort_order_idx on public.sponsors (sort_order);

drop trigger if exists sponsors_set_updated_at on public.sponsors;
create trigger sponsors_set_updated_at
  before update on public.sponsors
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_settings — generic key/value store for the Media & Links Hub
-- (hero video URL, promo banner URL, Discord/WhatsApp links, etc).
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- roadmap_items — "Upcoming Products / Roadmap" section.
-- ---------------------------------------------------------------------------
create table if not exists public.roadmap_items (
  id            uuid primary key default gen_random_uuid(),
  feature_name  text not null,
  status        text not null default 'planning'
                check (status in ('planning', 'in_progress', 'completed')),
  target_date   date,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists roadmap_items_sort_order_idx on public.roadmap_items (sort_order);

drop trigger if exists roadmap_items_set_updated_at on public.roadmap_items;
create trigger roadmap_items_set_updated_at
  before update on public.roadmap_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- legal_pages — Privacy Policy / Terms & Conditions / Platform Rules,
-- editable via a WYSIWYG in the CMS. Seeded with placeholder content so the
-- editor isn't blank on first load.
-- ---------------------------------------------------------------------------
create table if not exists public.legal_pages (
  slug          text primary key
                check (slug in ('privacy-policy', 'terms-conditions', 'platform-rules')),
  title         text not null,
  content_html  text not null default '',
  updated_at    timestamptz not null default now()
);

drop trigger if exists legal_pages_set_updated_at on public.legal_pages;
create trigger legal_pages_set_updated_at
  before update on public.legal_pages
  for each row execute function public.set_updated_at();

insert into public.legal_pages (slug, title, content_html)
values
  ('privacy-policy', 'Privacy Policy', '<p>Add your Privacy Policy content here from Admin &rarr; Content &amp; CMS &rarr; Legal.</p>'),
  ('terms-conditions', 'Terms &amp; Conditions', '<p>Add your Terms &amp; Conditions content here from Admin &rarr; Content &amp; CMS &rarr; Legal.</p>'),
  ('platform-rules', 'Platform Rules', '<p>Add your Platform Rules content here from Admin &rarr; Content &amp; CMS &rarr; Legal.</p>')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- As with phase 1, all admin mutations go through /api/admin/** using the
-- service role key (bypasses RLS). These policies only govern what a public
-- anon-key client may read directly.
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.users enable row level security;
alter table public.sponsors enable row level security;
alter table public.site_settings enable row level security;
alter table public.roadmap_items enable row level security;
alter table public.legal_pages enable row level security;

-- admins & users: no public policies at all — service role only.

drop policy if exists "Public can read sponsors" on public.sponsors;
create policy "Public can read sponsors"
  on public.sponsors for select
  using (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Public can read roadmap" on public.roadmap_items;
create policy "Public can read roadmap"
  on public.roadmap_items for select
  using (true);

drop policy if exists "Public can read legal pages" on public.legal_pages;
create policy "Public can read legal pages"
  on public.legal_pages for select
  using (true);

-- ---------------------------------------------------------------------------
-- cms-media storage bucket — sponsor logos, promo banners, admin avatars.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read cms-media" on storage.objects;
create policy "Public read cms-media"
  on storage.objects for select
  using (bucket_id = 'cms-media');
