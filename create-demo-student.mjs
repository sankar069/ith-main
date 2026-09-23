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

const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function createDemoStudent() {
  console.log('🎓 Creating Demo Student Account...\n');
  
  const demoEmail = 'demo.student@innotechhub.com';
  const demoPassword = 'Demo@2026';
  
  try {
    // Step 1: Create Supabase Auth User
    console.log('1️⃣ Creating Supabase Auth account...');
    
    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === demoEmail);
    
    let authUser;
    if (existingUser) {
      console.log('   ⚠️  Auth user already exists, using existing account');
      authUser = existingUser;
    } else {
      const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Demo Student',
        }
      });
      
      if (authError) {
        console.error('   ❌ Auth creation failed:', authError.message);
        throw authError;
      }
      authUser = newUser.user;
      console.log('   ✅ Auth user created');
    }
    
    // Step 2: Create/Update User Profile
    console.log('\n2️⃣ Creating user profile...');
    
    const { data: existingProfile } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', demoEmail)
      .single();
    
    let userId;
    if (existingProfile) {
      userId = existingProfile.id;
      console.log('   ℹ️  Profile already exists, will update data');
    } else {
      const { data: newProfile, error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          auth_user_id: authUser.id,
          full_name: 'Demo Student',
          email: demoEmail,
          phone: '+91 98765 43210',
          college: 'St. Peters Engineering College',
          department: 'Computer Science',
          year: 3,
          roll_number: 'CSE2021001',
          bio: 'Passionate about technology and innovation. Active participant in hackathons and coding competitions.',
          skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'Cloud Computing'],
          github_url: 'https://github.com/demostudent',
          linkedin_url: 'https://linkedin.com/in/demostudent',
          portfolio_url: 'https://demostudent.dev',
          avatar_url: '/DSC00912.JPG'
        })
        .select()
        .single();
      
      if (profileError) throw profileError;
      userId = newProfile.id;
      console.log('   ✅ Profile created');
    }
    
    // Step 3: Get some events
    console.log('\n3️⃣ Getting events for registration...');
    const { data: events } = await supabaseAdmin
      .from('events')
      .select('id, name, slug, status')
      .eq('status', 'published')
      .limit(5);
    
    console.log(`   ✅ Found ${events.length} events`);
    
    // Step 4: Create Event Registrations
    console.log('\n4️⃣ Creating event registrations...');
    
    const registrations = events.slice(0, 3).map((event, idx) => ({
      event_id: event.id,
      user_id: userId,
      student_name: 'Demo Student',
      student_email: demoEmail,
      student_phone: '+91 98765 43210',
      college: 'St. Peters Engineering College',
      team_name: idx === 0 ? 'Code Warriors' : null,
      payment_status: idx === 0 ? 'approved' : 'not_required',
      payment_proof_url: idx === 0 ? '/demo-payment-proof.jpg' : null,
    }));
    
    // Delete existing registrations first
    await supabaseAdmin
      .from('event_registrations')
      .delete()
      .eq('student_email', demoEmail);
    
    const { error: regError } = await supabaseAdmin
      .from('event_registrations')
      .insert(registrations);
    
    if (regError) throw regError;
    console.log(`   ✅ Created ${registrations.length} event registrations`);
    
    // Step 5: Create Certificates
    console.log('\n5️⃣ Creating certificates...');
    
    // Get past events for certificates
    const { data: pastEvents } = await supabaseAdmin
      .from('events')
      .select('id, name')
      .eq('status', 'completed')
      .limit(3);
    
    const certificates = pastEvents.slice(0, 2).map((event, idx) => ({
      user_id: userId,
      event_id: event.id,
      title: idx === 0 ? `${event.name} - Winner Certificate` : `${event.name} - Participation Certificate`,
      issuer: 'InnoTech Hub',
      certificate_url: `/certificates/demo-${idx + 1}.pdf`,
      status: 'earned',
      earned_date: new Date(Date.now() - (idx + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    
    // Delete existing certificates first
    await supabaseAdmin
      .from('certificates')
      .delete()
      .eq('student_email', demoEmail);
    
    const { error: certError } = await supabaseAdmin
      .from('certificates')
      .insert(certificates);
    
    if (certError) throw certError;
    console.log(`   ✅ Created ${certificates.length} certificates`);
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 DEMO STUDENT ACCOUNT CREATED SUCCESSFULLY!\n');
    console.log('='.repeat(70));
    console.log('\n📧 LOGIN CREDENTIALS:');
    console.log('\n   URL: http://localhost:3000/student/login');
    console.log(`   Email: ${demoEmail}`);
    console.log(`   Password: ${demoPassword}`);
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 DEMO DATA POPULATED:\n');
    console.log(`   ✅ User Profile: Complete with skills & links`);
    console.log(`   ✅ Event Registrations: ${registrations.length} events`);
    console.log(`   ✅ Certificates: ${certificates.length} certificates`);
    console.log(`   ✅ Authentication: Supabase Auth enabled`);
    console.log('\n' + '='.repeat(70));
    console.log('\n🎯 WHAT YOU CAN SHOWCASE:\n');
    console.log('   • Overview Dashboard (stats, recent activities)');
    console.log('   • My Events (registered events list)');
    console.log('   • Certificates (downloadable certificates)');
    console.log('   • Profile Settings (complete profile with skills)');
    console.log('   • Activity Timeline');
    console.log('\n' + '='.repeat(70));
    console.log('\n💡 TIP: Login now and explore the dashboard!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoStudent();
