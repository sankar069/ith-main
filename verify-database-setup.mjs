#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

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

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function verifySetup() {
  console.log('🔍 Verifying Database Setup...\n');
  
  const tables = [
    'events',
    'event_registrations',
    'admins',
    'users',
    'sponsors',
    'site_settings',
    'roadmap_items',
    'legal_pages',
    'certificates'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results[table] = '❌ Not found';
      } else {
        results[table] = '✅ Exists';
      }
    } catch (err) {
      results[table] = '❌ Error';
    }
  }
  
  console.log('📊 Database Tables Status:\n');
  Object.entries(results).forEach(([table, status]) => {
    console.log(`  ${status} ${table}`);
  });
  
  // Check admin accounts
  const { data: admins, error: adminError } = await supabase
    .from('admins')
    .select('email, role, status');
  
  if (!adminError && admins) {
    console.log('\n👤 Admin Accounts:');
    admins.forEach(admin => {
      console.log(`  • ${admin.email} (${admin.role}, ${admin.status})`);
    });
  }
  
  // Check events count
  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📅 Events in Database: ${eventsCount || 0}`);
  
  // Check users count
  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  console.log(`👥 Student Accounts: ${usersCount || 0}\n`);
  
  // Summary
  const missingTables = Object.entries(results).filter(([_, status]) => status.includes('❌'));
  
  if (missingTables.length > 0) {
    console.log('⚠️  Missing Tables:');
    missingTables.forEach(([table]) => {
      console.log(`   - ${table}`);
    });
    console.log('\n💡 You need to run the schema files in Supabase SQL Editor:');
    console.log('   1. supabase/schema.sql');
    console.log('   2. supabase/schema-phase2.sql');
    console.log('   3. supabase/schema-phase3.sql\n');
  } else {
    console.log('✅ All required tables exist!\n');
  }
}

verifySetup().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
