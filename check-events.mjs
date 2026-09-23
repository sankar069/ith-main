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

async function checkEvents() {
  console.log('📊 Checking events in database...\n');
  
  const { data: events, error } = await supabase
    .from('events')
    .select('id, name, status, start_date')
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ Found ${events.length} events:\n`);
  
  events.forEach((event, idx) => {
    const status = event.status === 'published' ? '✅' : 
                   event.status === 'completed' ? '📦' : '📝';
    console.log(`${idx + 1}. ${status} ${event.name}`);
    console.log(`   Status: ${event.status}`);
    console.log(`   Date: ${event.start_date || 'Not set'}\n`);
  });
  
  const published = events.filter(e => e.status === 'published').length;
  const completed = events.filter(e => e.status === 'completed').length;
  const draft = events.filter(e => e.status === 'draft').length;
  
  console.log(`📈 Summary:`);
  console.log(`   Published (Upcoming): ${published}`);
  console.log(`   Completed (Past): ${completed}`);
  console.log(`   Draft: ${draft}\n`);
  
  if (published === 0) {
    console.log('⚠️  No published events! Update events to status="published" to show them.\n');
  }
}

checkEvents();
