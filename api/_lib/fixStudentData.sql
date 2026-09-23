-- Fix script to populate student data with relationships
-- Run this in Supabase SQL Editor to fix the "Failed to load" errors

-- Step 1: Ensure sample users exist (they should from schema-phase2)
-- This query verifies users are set up
SELECT COUNT(*) as user_count FROM public.users;

-- Step 2: Link any sample data registrations to a user
-- If you have any sample registrations without user_id, link them to the first user
UPDATE public.event_registrations
SET user_id = (SELECT id FROM public.users LIMIT 1)
WHERE user_id IS NULL;

-- Step 3: Verify the updates
SELECT 
  COUNT(*) as total_registrations,
  COUNT(user_id) as with_user_id,
  COUNT(*) - COUNT(user_id) as without_user_id
FROM public.event_registrations;

-- Step 4: Check if there are any registrations at all
SELECT id, event_id, student_name, user_id FROM public.event_registrations LIMIT 10;

-- Step 5: Create sample registration data if none exist (optional)
-- Uncomment to seed sample registrations for testing
/*
INSERT INTO public.event_registrations (
  event_id, user_id, student_name, student_email, 
  college, registered_at, payment_status
)
SELECT 
  e.id,
  u.id,
  u.full_name,
  u.email,
  u.college,
  NOW(),
  'not_required'
FROM public.events e
CROSS JOIN public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_registrations er 
  WHERE er.event_id = e.id AND er.user_id = u.id
)
LIMIT 5;
*/
