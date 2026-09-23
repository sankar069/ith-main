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

const PAST_EVENTS = [
  {
    name: 'InnoTech Fest 2025',
    slug: 'innotech-fest-2025',
    category: 'festival',
    description: 'A grand gathering of innovators, entrepreneurs, and tech enthusiasts. Celebrated the InnoTech Hub community with workshops, talks, and networking.',
    status: 'completed',
    start_date: '2025-12-01T09:00:00Z',
    end_date: '2025-12-03T17:00:00Z',
    registration_deadline: '2025-11-25T23:59:59Z',
    venue_type: 'offline',
    venue_address: 'St. Peters Tech Campus, Bangalore',
    venue_link: null,
    banner_url: '/DSC00912.JPG',
    gallery_urls: ['/DSC00896 (1).JPG', '/DSC00909.JPG', '/DSC00912.JPG', '/DSC00915.JPG', '/DSC00931.JPG'],
    rules_text: 'Open to all students. No registration fee.',
    rules_doc_url: null,
    prize_pool: 200000,
    prize_details: 'Prizes distributed across multiple categories',
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'HackerRank Contest 2025',
    slug: 'hackerrank-contest-2025',
    category: 'competition',
    description: 'Annual coding competition in partnership with HackerRank. Hundreds of participants competed for prizes and recognition.',
    status: 'completed',
    start_date: '2025-11-15T10:00:00Z',
    end_date: '2025-11-15T14:00:00Z',
    registration_deadline: '2025-11-14T23:59:59Z',
    venue_type: 'online',
    venue_address: null,
    venue_link: 'https://hackerrank.com/contests/ith-2025',
    banner_url: '/hackerrank.png',
    gallery_urls: ['/hackerrank.png'],
    rules_text: 'Open to all participants worldwide.',
    rules_doc_url: null,
    prize_pool: 75000,
    prize_details: '1st: ₹35,000 | 2nd: ₹25,000 | 3rd: ₹15,000',
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'Cloud Computing Workshop 2025',
    slug: 'cloud-workshop-2025',
    category: 'workshop',
    description: 'Comprehensive workshop on AWS, Azure, and Google Cloud. Covered serverless, containers, and cloud architecture best practices.',
    status: 'completed',
    start_date: '2025-10-20T14:00:00Z',
    end_date: '2025-10-20T18:00:00Z',
    registration_deadline: '2025-10-18T23:59:59Z',
    venue_type: 'hybrid',
    venue_address: 'InnoTech Hub Main Campus',
    venue_link: 'https://meet.google.com/cloud-workshop',
    banner_url: '/DSC00949.JPG',
    gallery_urls: ['/DSC00949.JPG', '/DSC00984.JPG', '/DSC01006.JPG'],
    rules_text: 'Bring your laptop. Cloud account setup required.',
    rules_doc_url: null,
    prize_pool: null,
    prize_details: null,
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'Cybersecurity Summit 2025',
    slug: 'cybersecurity-summit-2025',
    category: 'seminar',
    description: 'Industry experts shared insights on ethical hacking, penetration testing, and modern security practices. Highly attended event.',
    status: 'completed',
    start_date: '2025-09-15T10:00:00Z',
    end_date: '2025-09-15T17:00:00Z',
    registration_deadline: '2025-09-10T23:59:59Z',
    venue_type: 'offline',
    venue_address: 'Grand Tech Auditorium, Bangalore',
    venue_link: null,
    banner_url: '/DSC01035.JPG',
    gallery_urls: ['/DSC01035.JPG', '/DSC01224.JPG', '/DSC01231.JPG'],
    rules_text: 'Open to all students and professionals.',
    rules_doc_url: null,
    prize_pool: null,
    prize_details: null,
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
];

async function addPastEvents() {
  console.log('📦 Adding past/completed events...\n');
  
  try {
    const { data, error } = await supabase
      .from('events')
      .upsert(PAST_EVENTS, { onConflict: 'slug' })
      .select();
    
    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ Successfully added ${data.length} past events!\n`);
    
    // Check total counts
    const { data: allEvents } = await supabase
      .from('events')
      .select('status')
      .order('start_date', { ascending: true });
    
    const published = allEvents.filter(e => e.status === 'published').length;
    const completed = allEvents.filter(e => e.status === 'completed').length;
    
    console.log('📊 Database Summary:');
    console.log(`   ✅ Published (Upcoming): ${published}`);
    console.log(`   📦 Completed (Past): ${completed}`);
    console.log(`   📈 Total Events: ${allEvents.length}\n`);
    
    console.log('🎉 Your website now has both upcoming and past events!\n');
    console.log('💡 Refresh your browser to see the changes.\n');
    
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

addPastEvents();
