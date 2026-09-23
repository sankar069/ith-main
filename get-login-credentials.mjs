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

async function getCredentials() {
  console.log('🔐 Login Credentials for InnoTech Hub\n');
  console.log('=' .repeat(60));
  
  // Admin credentials
  console.log('\n👔 ADMIN LOGIN\n');
  console.log('URL: http://localhost:3000/admin/login');
  console.log('Email: ithadmin@ith.com');
  console.log('Password: admin@2026');
  console.log('\nRole: Super Admin');
  console.log('Access: Full system control\n');
  
  // Get student accounts
  const { data: students, error } = await supabase
    .from('users')
    .select('full_name, email, phone, college')
    .limit(5);
  
  if (error) {
    console.error('Error fetching students:', error.message);
    return;
  }
  
  console.log('=' .repeat(60));
  console.log('\n👨‍🎓 STUDENT LOGIN\n');
  console.log('URL: http://localhost:3000/student/signup (or /student/login)\n');
  
  if (students && students.length > 0) {
    console.log('Sample Student Accounts (you need to sign up first):');
    students.slice(0, 3).forEach((student, idx) => {
      console.log(`\n${idx + 1}. ${student.full_name}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   College: ${student.college}`);
    });
    console.log('\nNote: These are profiles. Students must sign up with Supabase Auth.');
    console.log('      Use the Sign Up page to create a student account.\n');
  } else {
    console.log('No student profiles found. Students can sign up at:');
    console.log('http://localhost:3000/student/signup\n');
  }
  
  console.log('=' .repeat(60));
  console.log('\n📊 SYSTEM STATUS\n');
  
  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });
  
  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  console.log(`✅ Server Running: http://localhost:3000`);
  console.log(`✅ Database Connected: ${env.SUPABASE_URL.includes('supabase.co') ? 'Yes' : 'No'}`);
  console.log(`✅ Events Available: ${eventsCount || 0}`);
  console.log(`✅ Student Profiles: ${usersCount || 0}`);
  console.log('\n' + '=' .repeat(60) + '\n');
}

getCredentials().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
