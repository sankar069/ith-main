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

async function testAPI() {
  console.log('🧪 Testing API query (simulating /api/events endpoint)...\n');
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('start_date', { ascending: true, nullsFirst: false });
    
    if (error) {
      console.error('❌ Query failed:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ Query successful! Found ${data.length} published events\n`);
    
    data.slice(0, 3).forEach((event, idx) => {
      console.log(`${idx + 1}. ${event.name}`);
      console.log(`   📅 ${event.start_date ? new Date(event.start_date).toLocaleDateString() : 'No date'}`);
      console.log(`   📍 ${event.venue_type || 'No venue'}`);
      console.log(`   🎫 ${event.payment_required ? `₹${event.payment_amount}` : 'Free'}\n`);
    });
    
    if (data.length > 3) {
      console.log(`   ... and ${data.length - 3} more events\n`);
    }
    
    console.log('✅ Your API endpoint should work correctly!\n');
    console.log('💡 Now run: npm run dev');
    console.log('   Then visit: http://localhost:5173\n');
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testAPI();
