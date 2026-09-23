# InnoTech-Hub Admin Console — Setup

**Phase 1** shipped admin login, the admin shell (sidebar/header/breadcrumbs/toasts),
and the **Event Management Engine** (master list + creation/edit wizard).

**Phase 2** unlocks the three modules that were "Soon" placeholders: **Student & User
Management**, **Content & CMS** (Sponsors, Media & Links, Roadmap, Legal), and **Admin
Settings** (profile, password, sub-admin roster). All of it is backed by real Supabase
tables and Vercel serverless API routes — nothing in this console is mocked at the
backend layer.

**Auth model change in Phase 2:** login now checks a real `admins` table instead of
only comparing against a hardcoded/env constant. The originally-seeded super admin
(`ithadmin@ith.com`) has no password set yet, so it still logs in with the spec's
hardcoded password (`admin@2026`, or your `ADMIN_PASSWORD` override) as a bootstrap —
but once you set a real password from Settings → Change Password, that password
becomes authoritative and the hardcoded one stops working for that account. Sub-admins
invited from Settings are stored with `status: 'invited'` and no password — there's no
invite-accept/email flow yet, so they can't log in until that's built; the roster is
there so you can see and manage who has access.

**Phase 3** wires the **Student Dashboard** to real data. Students now sign up/log in
with real Supabase Auth (not a mock), and the **Overview**, **My Events**, and
**Certificates** tabs are fully backed by real `/api/student/**` endpoints and
Postgres tables. The other six dashboard tabs (Projects, Billing, Mentorship/AI Suite,
Requirements, Explore Events, Settings) had their hardcoded mock data stripped out and
replaced with honest empty states and loading skeletons — Settings' profile fields are
real too — but they don't have dedicated backend tables yet, so they're intentionally
scaffolded rather than wired end-to-end. See "What's not built yet" below for specifics.
**The hardcoded admin login (`ithadmin@ith.com` / `admin@2026`) was untouched by this
pass** — this phase only affects the student-facing side of the app.

A note on design: the prompt asked for a "neon cyan/purple" dark theme, but the live
site's actual design system (see `src/components/dashboard/DashboardTheme.js`) is the
warm "cozy" theme — burnt orange `#c84c30` primary, off-white/navy backgrounds,
Playfair Display + Plus Jakarta Sans. The admin console was built to match what's
*actually* on the site today, reusing the same UI kit as the student dashboard. Say
the word if you'd rather it match the neon direction instead.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Once it's created, open **Project Settings → API**. You'll need:
   - **Project URL** → `SUPABASE_URL`
   - **service_role secret key** (not the `anon` key) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the contents of `supabase/schema.sql` and click **Run**. This creates the
   `events` and `event_registrations` tables, RLS policies, and two public storage
   buckets (`event-media`, `event-docs`).
3. Run a **second** query with the contents of `supabase/schema-phase2.sql`. This adds
   `admins`, `users`, `sponsors`, `site_settings`, `roadmap_items`, and `legal_pages`,
   plus a third storage bucket (`cms-media`) for sponsor logos/promo banners/avatars.
   It also seeds the super admin row and a handful of **sample student rows** so the
   Global User Table isn't empty on first load — delete those once real signups exist.

4. Run a **third** query with the contents of `supabase/schema-phase3.sql`. This adds
   an `auth_user_id` column linking `public.users` rows to real Supabase Auth accounts,
   a trigger (`handle_new_student`) that auto-creates a `users` profile row whenever
   someone signs up, a `user_id` link on `event_registrations`, and a new
   `certificates` table. Run this after `schema-phase2.sql`, since it alters tables
   the second file creates.

Both files are safe to re-run — every statement is idempotent. Run `schema.sql`,
`schema-phase2.sql`, then `schema-phase3.sql` in that order (each relies on tables or
helper functions the previous file creates).

## 3. Environment variables

Copy `.env.example` to `.env` and fill in:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_JWT_SECRET=...        # any long random string, e.g. `openssl rand -hex 32`
ADMIN_EMAIL=ithadmin@ith.com       # optional override
ADMIN_PASSWORD=admin@2026          # optional override

# Client-side — used by the student sign-up/login flow (Phase 3)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

`ADMIN_EMAIL`/`ADMIN_PASSWORD` are optional — if unset, the API falls back to the
hardcoded spec credentials (`ithadmin@ith.com` / `admin@2026`). Setting them lets you
change the real login without touching code once this goes to production.

`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are the **public anon key**, safe to
expose client-side — find them next to the service-role key in Project Settings → API.
Without these set, student sign-up/login will fail (the admin console is unaffected;
it doesn't use Supabase Auth).

**Also set these same variables in Vercel** (Project → Settings → Environment
Variables) for Preview and Production — `.env` is only read locally and is
git-ignored.

## 4. Running locally

This project's `/api` folder uses **Vercel Serverless Functions**, which the plain
`vite dev` server does not execute (it only serves the frontend). To run the full
stack locally, install the Vercel CLI and use `vercel dev` instead:

```bash
npm install
npm i -g vercel        # if you don't already have it
vercel dev
```

`vercel dev` serves both the Vite frontend and the `/api` functions together on one
port, reading env vars from `.env`. Running plain `npm run dev` still works for
frontend-only UI review, but any admin API call (login, event CRUD, uploads) will
404 until you use `vercel dev` or deploy.

## 5. Logging in

Visit `/admin/login` and sign in with the admin credentials from step 3 — this calls
the real `/api/admin/login` (DB-backed, described above), so you must be running
`vercel dev` and have run all three schema files first, or login will fail with
"Invalid admin credentials." The session is a 12-hour JWT stored in `localStorage`,
and the route guard re-verifies it against `/api/admin/me` on every page load.

## 6. Deploying

Push to your connected Git repo as usual — Vercel auto-detects the `/api` functions
alongside the Vite build. Just make sure the environment variables from step 3 are
set in the Vercel project first, or the API routes will fail with a clear "Missing
SUPABASE_URL…" / "Missing ADMIN_JWT_SECRET…" error rather than a silent failure.

## What's not built yet

- **Event Workspace** (per-event tabs: Registrations / Payments & Verifications /
  Team Details / Certificate Issuer) — `event_registrations` table exists so this can
  be built against real data next.
- The public-facing registration flow that would actually populate `event_registrations`
  for a given student — until it exists, students won't see anything in **My Events**
  even after signing up, and admins have to link registrations manually.
- **Real sub-admin login** — invites are stored, but there's no invite-accept email
  or password-set flow, so invited accounts can't sign in yet.
- **Public pages consuming the new CMS content** — the Sponsors/Media/Roadmap/Legal
  tabs read and write real data, but the public-facing site (partners section, legal
  pages, homepage hero) still uses its existing hardcoded content. Wiring those to
  fetch from `sponsors` / `site_settings` / `roadmap_items` / `legal_pages` is a
  natural next step — say the word and it's a fairly small change on top of what's
  here.
- **Student dashboard tabs without a backend yet** — Projects, Billing, Mentorship/AI
  Suite, Requirements (deadlines/compliance checklist), and Explore Events show clean
  empty states with no mock data, but there's no `projects` / `billing` / `ai_usage` /
  `deadlines` table behind them. They're wired to real profile data where it already
  existed (e.g. Settings) but otherwise need new schema + API routes before they can
  show anything.

Ask to build any of these next and they'll slot into the same shell, DataTable, and
API conventions established here.
