#!/usr/bin/env node

/**
 * Automated Fix Script for Dashboard Errors
 * Usage: node scripts/fix-dashboard-data.mjs
 * 
 * This script fixes the "Failed to load" errors by:
 * 1. Creating sample users if they don't exist
 * 2. Linking orphaned data to users
 * 3. Creating sample data for testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse .env
const env = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixDashboardData() {
  try {
    console.log('🔧 Starting Dashboard Data Fix...\n');

    // Step 1: Ensure sample users exist
    console.log('📍 Step 1: Checking users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, status')
      .limit(1);

    if (usersError) {
      throw new Error(`Failed to check users: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      console.log('  ⚠️  No users found. Creating sample user...');
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          full_name: 'Test Student',
          email: 'test@innotech.edu',
          college: 'St. Peters Engineering College',
          graduation_year: 2025,
          status: 'active'
        }])
        .select();

      if (createError) throw new Error(`Failed to create user: ${createError.message}`);
      console.log('  ✅ Sample user created');
    } else {
      console.log(`  ✅ Found ${users.length} user(s)`);
    }

    // Step 2: Get a user to link data to
    const { data: allUsers } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const userId = allUsers?.[0]?.id;
    if (!userId) throw new Error('Could not find user to link data to');

    // Step 3: Link orphaned event registrations
    console.log('\n📍 Step 2: Fixing event registrations...');
    const { data: orphanedRegs, error: orphanError } = await supabase
      .from('event_registrations')
      .select('id')
      .is('user_id', null);

    if (!orphanError && orphanedRegs?.length > 0) {
      const { error: linkError } = await supabase
        .from('event_registrations')
        .update({ user_id: userId })
        .is('user_id', null);

      if (linkError) {
        console.log('  ⚠️  Could not link registrations:', linkError.message);
      } else {
        console.log(`  ✅ Linked ${orphanedRegs.length} orphaned registration(s)`);
      }
    } else {
      console.log('  ✅ All registrations properly linked');
    }

    // Step 4: Link orphaned certificates
    console.log('\n📍 Step 3: Fixing certificates...');
    const { data: orphanedCerts, error: certError } = await supabase
      .from('certificates')
      .select('id')
      .is('user_id', null);

    if (!certError && orphanedCerts?.length > 0) {
      const { error: linkCertError } = await supabase
        .from('certificates')
        .update({ user_id: userId })
        .is('user_id', null);

      if (linkCertError) {
        console.log('  ⚠️  Could not link certificates:', linkCertError.message);
      } else {
        console.log(`  ✅ Linked ${orphanedCerts.length} orphaned certificate(s)`);
      }
    } else {
      console.log('  ✅ All certificates properly linked');
    }

    // Step 5: Link orphaned projects
    console.log('\n📍 Step 4: Fixing projects...');
    const { data: orphanedProjs, error: projError } = await supabase
      .from('projects')
      .select('id')
      .is('user_id', null);

    if (!projError && orphanedProjs?.length > 0) {
      const { error: linkProjError } = await supabase
        .from('projects')
        .update({ user_id: userId })
        .is('user_id', null);

      if (linkProjError) {
        console.log('  ⚠️  Could not link projects:', linkProjError.message);
      } else {
        console.log(`  ✅ Linked ${orphanedProjs.length} orphaned project(s)`);
      }
    } else {
      console.log('  ✅ All projects properly linked');
    }

    // Step 6: Create sample data if needed
    console.log('\n📍 Step 5: Creating sample data...');

    // Check if user has any registrations
    const { data: userRegs } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (!userRegs || userRegs.length === 0) {
      // Get a published event
      const { data: events } = await supabase
        .from('events')
        .select('id')
        .eq('status', 'published')
        .limit(1);

      if (events?.length > 0) {
        const { error: regError } = await supabase
          .from('event_registrations')
          .insert([{
            event_id: events[0].id,
            user_id: userId,
            student_name: 'Test Student',
            student_email: 'test@innotech.edu',
            college: 'St. Peters Engineering College',
            payment_status: 'not_required'
          }]);

        if (!regError) {
          console.log('  ✅ Created sample event registration');
        }
      }
    } else {
      console.log('  ✅ User already has registrations');
    }

    // Check if user has any certificates
    const { data: userCerts } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (!userCerts || userCerts.length === 0) {
      const { error: certError } = await supabase
        .from('certificates')
        .insert([{
          user_id: userId,
          title: 'React Developer Certification',
          issuer: 'InnoTech Hub',
          status: 'earned',
          earned_date: new Date().toISOString().split('T')[0]
        }]);

      if (!certError) {
        console.log('  ✅ Created sample certificate');
      }
    } else {
      console.log('  ✅ User already has certificates');
    }

    // Check if user has any projects
    const { data: userProjs } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (!userProjs || userProjs.length === 0) {
      const { error: projError } = await supabase
        .from('projects')
        .insert([{
          user_id: userId,
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution built with React and Node.js',
          stage: 'ideation',
          skills: ['React', 'Node.js', 'PostgreSQL']
        }]);

      if (!projError) {
        console.log('  ✅ Created sample project');
      }
    } else {
      console.log('  ✅ User already has projects');
    }

    // Final verification
    console.log('\n📍 Step 6: Verifying fixes...');
    const { data: finalRegs } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('user_id', userId);

    const { data: finalCerts } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', userId);

    const { data: finalProjs } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId);

    console.log(`  📊 Event Registrations: ${finalRegs?.length || 0}`);
    console.log(`  📊 Certificates: ${finalCerts?.length || 0}`);
    console.log(`  📊 Projects: ${finalProjs?.length || 0}`);

    console.log('\n✅ Dashboard data fix completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Sign in to your dashboard');
    console.log('  2. Refresh the page (Ctrl+R)');
    console.log('  3. Errors should now be gone! 🎉\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check your .env file has correct Supabase credentials');
    console.error('  2. Verify all database schema files are applied');
    console.error('  3. Check Supabase dashboard for any errors\n');
    process.exit(1);
  }
}

fixDashboardData().then(() => {
  process.exit(0);
});
