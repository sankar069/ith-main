# Fix Dashboard Errors - Complete Diagnostic & Solution

## ❌ Errors You're Seeing

- "Failed to load events"
- "Something went wrong. Please try again"

These errors appear on:
- Explore Events tab
- My Events tab
- Certificates tab
- Projects tab
- Billing tab

## 🔍 Root Cause Analysis

The dashboard components are trying to load data via these endpoints:
- `/api/student/events` - User's event registrations
- `/api/student/certificates` - User's certificates
- `/api/student/projects` - User's projects
- `/api/student/profile` - User's profile data

All these endpoints require:
1. ✅ Valid authentication token (Bearer token in Authorization header)
2. ⚠️ **User profile exists in database** (might be missing!)
3. ⚠️ **Data is linked to user by user_id** (might not be set!)

## 🛠️ Solution - Step by Step

### Step 1: Verify Authentication Is Working

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
console.log(localStorage.getItem('ith_student_token'));
console.log(JSON.parse(localStorage.getItem('ith_student_profile') || '{}'));
```

**Expected:**
- Token should be a long string starting with `eyJ...`
- Profile should have: `{id, full_name, email, college, ...}`

**If empty:**
- User needs to sign in first
- Try logging in again

### Step 2: Check Your Supabase Setup

1. Go to [Supabase Dashboard](https://app.supabase.co)
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Run this query:

```sql
-- Check if users table exists and has data
SELECT COUNT(*) as user_count FROM public.users;
```

**Expected:** Count > 0 (at least 8 sample users)

**If 0:**
- Schema not applied
- Run `supabase/schema-phase2.sql` in SQL Editor

### Step 3: Fix Missing User Profile Linking

If users don't have profiles, the API will return 404. Run this:

```sql
-- Create profile for the logged-in user if missing
-- Replace 'your-email@example.com' with the email you're testing with

INSERT INTO public.users (full_name, email, college, status, auth_user_id)
SELECT
  (SELECT email FROM auth.users LIMIT 1) as name,
  (SELECT email FROM auth.users LIMIT 1) as email,
  'Your College Name' as college,
  'active' as status,
  id as auth_user_id
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.users.id)
LIMIT 1;
```

### Step 4: Link Sample Data to Users

Run this to link existing sample data:

```sql
-- Link event registrations to users
UPDATE public.event_registrations
SET user_id = (
  SELECT DISTINCT u.id 
  FROM public.users u 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Link certificates to users
UPDATE public.certificates
SET user_id = (
  SELECT DISTINCT u.id 
  FROM public.users u 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Link projects to users
UPDATE public.projects
SET user_id = (
  SELECT DISTINCT u.id 
  FROM public.users u 
  LIMIT 1
)
WHERE user_id IS NULL;
```

### Step 5: Seed Sample Data

If the tables are empty, run:

```sql
-- Create sample registrations
INSERT INTO public.event_registrations (
  event_id, user_id, student_name, student_email,
  college, payment_status, registered_at
)
SELECT
  e.id,
  (SELECT id FROM public.users LIMIT 1) as user_id,
  'John Doe' as student_name,
  (SELECT email FROM public.users LIMIT 1) as student_email,
  'St. Peters Engineering College' as college,
  'not_required' as payment_status,
  NOW() as registered_at
FROM public.events e
WHERE e.status = 'published'
LIMIT 3;

-- Create sample certificates
INSERT INTO public.certificates (
  user_id, title, issuer, status, earned_date
) 
SELECT
  (SELECT id FROM public.users LIMIT 1) as user_id,
  'Advanced React Developer' as title,
  'InnoTech Hub' as issuer,
  'earned' as status,
  CURRENT_DATE - INTERVAL '30 days' as earned_date
WHERE NOT EXISTS (SELECT 1 FROM public.certificates LIMIT 1);

-- Create sample projects
INSERT INTO public.projects (
  user_id, title, description, stage, skills
)
SELECT
  (SELECT id FROM public.users LIMIT 1) as user_id,
  'E-Commerce Platform' as title,
  'A full-stack e-commerce solution with React and Node.js' as description,
  'github_linked' as stage,
  ARRAY['React', 'Node.js', 'PostgreSQL'] as skills
WHERE NOT EXISTS (SELECT 1 FROM public.projects LIMIT 1);
```

## 📋 Complete Diagnostic Checklist

Run this query to diagnose everything:

```sql
-- Complete diagnostic report

-- 1. Check users table
SELECT 'Users' as table_name, COUNT(*) as count FROM public.users;

-- 2. Check events table
SELECT 'Events' as table_name, COUNT(*) as count FROM public.events;

-- 3. Check event_registrations
SELECT 'Registrations' as table_name, COUNT(*) as total, 
       COUNT(user_id) as with_user_id FROM public.event_registrations;

-- 4. Check certificates
SELECT 'Certificates' as table_name, COUNT(*) as total,
       COUNT(user_id) as with_user_id FROM public.certificates;

-- 5. Check projects
SELECT 'Projects' as table_name, COUNT(*) as total,
       COUNT(user_id) as with_user_id FROM public.projects;

-- 6. Check auth.users
SELECT 'Auth Users' as table_name, COUNT(*) as count FROM auth.users;

-- 7. Check user-auth linkage
SELECT COUNT(*) as users_with_auth FROM public.users WHERE auth_user_id IS NOT NULL;
```

## 🔧 API Testing

### Test an endpoint directly:

1. Copy your auth token from browser console:
```javascript
localStorage.getItem('ith_student_token')
```

2. Open a terminal and test:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5173/api/student/events
```

**Expected response:**
```json
{"registrations": [...]}
```

**If 401:** Token is invalid or expired
**If 404:** User profile doesn't exist
**If 500:** Database query failed

## 🚀 Quick Fix (Recommended)

Do this in order:

1. **Go to Supabase SQL Editor**
2. **Copy and run this complete fix:**

```sql
-- Step 1: Create test user if none exist
INSERT INTO public.users (full_name, email, college, graduation_year, status)
SELECT 'Test Student', 'test@example.com', 'Test College', 2025, 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test@example.com');

-- Step 2: Link all orphaned data to first user
UPDATE public.event_registrations
SET user_id = (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
WHERE user_id IS NULL;

UPDATE public.certificates
SET user_id = (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
WHERE user_id IS NULL;

UPDATE public.projects
SET user_id = (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
WHERE user_id IS NULL;

-- Step 3: Create sample data if empty
INSERT INTO public.event_registrations (event_id, user_id, student_name, student_email, college, payment_status)
SELECT e.id, u.id, u.full_name, u.email, u.college, 'not_required'
FROM public.events e, public.users u
WHERE e.status = 'published' AND NOT EXISTS (
  SELECT 1 FROM public.event_registrations WHERE event_id = e.id
) LIMIT 3;

INSERT INTO public.certificates (user_id, title, issuer, status)
SELECT u.id, 'Sample Certificate', 'InnoTech Hub', 'earned'
FROM public.users u
WHERE NOT EXISTS (SELECT 1 FROM public.certificates WHERE user_id = u.id)
LIMIT 1;

INSERT INTO public.projects (user_id, title, description, stage, skills)
SELECT u.id, 'Sample Project', 'Test project', 'ideation', ARRAY['React', 'Node.js']
FROM public.users u
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE user_id = u.id)
LIMIT 1;

-- Verify fixes
SELECT 'Users' as check_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'Events' as check_name, COUNT(*) FROM public.events
UNION ALL
SELECT 'Registrations with user_id' as check_name, COUNT(*) FROM public.event_registrations WHERE user_id IS NOT NULL;
```

3. **Click Run** → Should see success
4. **Refresh your browser** at `/dashboard`
5. **Errors should be gone!** ✅

## 🔑 Key Points to Remember

- **Tokens expire:** If errors return after working, user session expired → Sign in again
- **User profiles are auto-created:** When user signs up via Supabase Auth, a profile is auto-generated by the trigger
- **Data must be linked:** All event_registrations, certificates, and projects must have a `user_id`
- **Auth is server-side:** API checks tokens and user profiles server-side before returning data

## 📞 If Errors Persist

1. **Check browser console** for specific error messages
2. **Check Supabase logs** - Dashboard → Logs → Edge Functions
3. **Verify all schema phases applied:** schema.sql, schema-phase2.sql, schema-phase3.sql, etc.
4. **Clear browser cache:** F12 → Network tab → Disable cache, then refresh
5. **Check user status:** Run `SELECT * FROM public.users;` - status should be 'active'

## ✅ Success Indicators

When fixed, you should see:
- ✅ Events tab loads and shows registrations (or "No registrations yet")
- ✅ Certificates tab loads and shows certificates (or empty)
- ✅ Projects tab loads and shows projects (or empty)
- ✅ No red error notifications

---

**Need help?** Check the browser Network tab (F12) to see exact error messages from API responses.
