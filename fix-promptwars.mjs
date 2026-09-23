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

async function fixPromptWars() {
  console.log('🔧 Fixing PromptWars event date...\n');
  
  // Find the event by name pattern
  const { data: events, error: findError } = await supabase
    .from('events')
    .select('*')
    .ilike('name', '%PromptWars%')
    .eq('status', 'published');
  
  if (findError) {
    console.error('❌ Error finding event:', findError.message);
    return;
  }
  
  if (!events || events.length === 0) {
    console.log('⚠️  PromptWars event not found');
    return;
  }
  
  const event = events[0];
  console.log(`Found: ${event.name} (slug: ${event.slug})`);
  
  // Update with a date in December 2026
  const { error: updateError } = await supabase
    .from('events')
    .update({
      start_date: '2026-12-20T10:00:00Z',
      end_date: '2026-12-20T18:00:00Z',
      registration_deadline: '2026-12-18T23:59:59Z',
    })
    .eq('id', event.id);
  
  if (updateError) {
    console.error('❌ Update failed:', updateError.message);
    return;
  }
  
  console.log('✅ Successfully updated PromptWars event!');
  console.log('   Start Date: December 20, 2026\n');
}

fixPromptWars();
