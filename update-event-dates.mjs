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

console.log('📅 Current system date: September 22, 2026');
console.log('🔄 Updating event dates to be in the future...\n');

// Update events to have dates AFTER September 22, 2026
const updates = [
  {
    slug: 'web-dev-workshop-2026',
    start_date: '2026-10-20T14:00:00Z',
    end_date: '2026-10-20T18:00:00Z',
    registration_deadline: '2026-10-18T23:59:59Z',
  },
  {
    slug: 'hack2skills-code-challenge-2026',
    start_date: '2026-10-28T12:00:00Z',
    end_date: '2026-10-28T16:00:00Z',
    registration_deadline: '2026-10-27T23:59:59Z',
  },
  {
    slug: 'geeksforgeeks-masterclass-2026',
    start_date: '2026-11-08T11:00:00Z',
    end_date: '2026-11-08T13:00:00Z',
    registration_deadline: '2026-11-07T23:59:59Z',
  },
  {
    slug: 'innotech-hackathon-2026',
    start_date: '2026-11-15T09:00:00Z',
    end_date: '2026-11-16T09:00:00Z',
    registration_deadline: '2026-11-10T23:59:59Z',
  },
  {
    slug: 'ai-ml-summit-2026',
    start_date: '2026-11-22T10:00:00Z',
    end_date: '2026-11-22T16:00:00Z',
    registration_deadline: '2026-11-20T23:59:59Z',
  },
  {
    slug: 'startup-pitch-competition-2026',
    start_date: '2026-12-05T18:00:00Z',
    end_date: '2026-12-05T21:00:00Z',
    registration_deadline: '2026-12-01T23:59:59Z',
  },
  {
    slug: 'gemini-ai-workshop-2026',
    start_date: '2026-12-12T15:00:00Z',
    end_date: '2026-12-12T17:00:00Z',
    registration_deadline: '2026-12-10T23:59:59Z',
  },
  {
    slug: 'innotech-hub-promptwars-2026',
    start_date: '2026-12-20T10:00:00Z',
    end_date: '2026-12-20T18:00:00Z',
    registration_deadline: '2026-12-18T23:59:59Z',
  },
];

async function updateDates() {
  try {
    let updated = 0;
    
    for (const update of updates) {
      const { slug, ...dates } = update;
      
      const { error } = await supabase
        .from('events')
        .update(dates)
        .eq('slug', slug)
        .eq('status', 'published');
      
      if (error) {
        console.log(`⚠️  ${slug}: ${error.message}`);
      } else {
        updated++;
        console.log(`✅ Updated: ${slug}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updated} events!\n`);
    
    // Show upcoming events
    const { data: upcomingEvents } = await supabase
      .from('events')
      .select('name, start_date, status')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });
    
    console.log('📊 Upcoming Events (after today):');
    upcomingEvents?.forEach((event, idx) => {
      const date = new Date(event.start_date);
      console.log(`${idx + 1}. ${event.name} - ${date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}`);
    });
    
    console.log('\n💡 Refresh your browser to see the changes!\n');
    
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

updateDates();
