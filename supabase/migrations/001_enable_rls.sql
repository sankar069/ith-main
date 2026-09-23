/**
 * SUPABASE ROW LEVEL SECURITY POLICIES
 * Execute these policies in Supabase SQL Editor
 * 
 * CRITICAL: This ensures users can only access their own data
 */

-- ============================================================================
-- 1. USERS TABLE (Student Profiles)
-- ============================================================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "users_select_own"
  ON users
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Users can update their own profile
CREATE POLICY "users_update_own"
  ON users
  FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Service role bypasses RLS (for admin operations)
-- No explicit policy needed - service role bypasses RLS by default

-- ============================================================================
-- 2. EVENT_REGISTRATIONS TABLE
-- ============================================================================

-- Enable RLS on event_registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Students can view their own registrations
CREATE POLICY "registrations_select_own"
  ON event_registrations
  FOR SELECT
  USING (
    auth.uid() = (
      SELECT auth_user_id FROM users WHERE id = event_registrations.student_id
    )
  );

-- Students can insert their own registrations
CREATE POLICY "registrations_insert_own"
  ON event_registrations
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT auth_user_id FROM users WHERE id = event_registrations.student_id
    )
  );

-- Students can update their own registrations (before approval)
CREATE POLICY "registrations_update_own"
  ON event_registrations
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT auth_user_id FROM users WHERE id = event_registrations.student_id
    )
    AND status != 'approved' -- Can't modify approved registrations
  );

-- ============================================================================
-- 3. EVENTS TABLE (Public read, admin write)
-- ============================================================================

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Events are viewable by everyone (public)
CREATE POLICY "events_select_public"
  ON events
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete events
-- No explicit INSERT/UPDATE/DELETE policies needed
-- Service role bypasses RLS

-- ============================================================================
-- 4. ATTENDANCE TABLE
-- ============================================================================

-- Enable RLS on attendance (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'attendance') THEN
    ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
    
    -- Students can view their own attendance
    CREATE POLICY "attendance_select_own"
      ON attendance
      FOR SELECT
      USING (
        auth.uid() = (
          SELECT auth_user_id FROM users WHERE id = attendance.student_id
        )
      );
  END IF;
END $$;

-- ============================================================================
-- 5. VOLUNTEERS TABLE
-- ============================================================================

-- Enable RLS on volunteers (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'volunteers') THEN
    ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
    
    -- Students can view their own volunteer records
    CREATE POLICY "volunteers_select_own"
      ON volunteers
      FOR SELECT
      USING (
        auth.uid() = (
          SELECT auth_user_id FROM users WHERE id = volunteers.student_id
        )
      );
  END IF;
END $$;

-- ============================================================================
-- 6. CERTIFICATES TABLE
-- ============================================================================

-- Enable RLS on certificates (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'certificates') THEN
    ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
    
    -- Students can view their own certificates
    CREATE POLICY "certificates_select_own"
      ON certificates
      FOR SELECT
      USING (
        auth.uid() = (
          SELECT auth_user_id FROM users WHERE id = certificates.student_id
        )
      );
  END IF;
END $$;

-- ============================================================================
-- 7. PROJECTS TABLE
-- ============================================================================

-- Enable RLS on projects (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'projects') THEN
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    
    -- Students can view their own projects
    CREATE POLICY "projects_select_own"
      ON projects
      FOR SELECT
      USING (
        auth.uid() = (
          SELECT auth_user_id FROM users WHERE id = projects.student_id
        )
      );
    
    -- Students can insert their own projects
    CREATE POLICY "projects_insert_own"
      ON projects
      FOR INSERT
      WITH CHECK (
        auth.uid() = (
          SELECT auth_user_id FROM users WHERE id = projects.student_id
        )
      );
    
    -- Students can update their own projects
    CREATE POLICY "projects_update_own"
      ON projects
      FOR UPDATE
      USING (
        auth.uid() = (
          SELECT auth_user_id FROM users WHERE id = projects.student_id
        )
      );
  END IF;
END $$;

-- ============================================================================
-- 8. AUDIT_LOGS TABLE (Create if doesn't exist)
-- ============================================================================

-- Create audit_logs table for security event tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  target_resource TEXT,
  target_type TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_email ON audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can write to audit_logs
-- No SELECT policy - only admins via service role can read
-- This prevents users from viewing audit logs

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these to verify RLS is enabled:
-- 
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('users', 'events', 'event_registrations', 'audit_logs');
--
-- Expected output: All should have rowsecurity = true

-- View policies:
-- 
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- 1. Service role bypasses RLS (used by API functions)
-- 2. Anon key respects RLS (used by student Supabase client)
-- 3. Authenticated users (via auth.uid()) have restricted access
-- 4. Admin operations use service role, bypassing RLS
-- 5. Audit logs are write-only for tracking purposes
