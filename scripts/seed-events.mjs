#!/usr/bin/env node

/**
 * Seed Events Script
 * Usage: node scripts/seed-events.mjs
 * 
 * This script populates the Supabase database with sample events
 * for the upcoming and past events sections.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Simple .env parser
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

const SAMPLE_EVENTS = [
  {
    name: 'InnoTech Hackathon 2026',
    slug: 'innotech-hackathon-2026',
    category: 'hackathon',
    description: 'A 24-hour innovation marathon where students collaborate to build cutting-edge solutions. Compete for prizes, mentorship, and recognition in the InnoTech Hub ecosystem.',
    status: 'published',
    start_date: '2026-03-15T09:00:00Z',
    end_date: '2026-03-16T09:00:00Z',
    registration_deadline: '2026-03-10T23:59:59Z',
    venue_type: 'offline',
    venue_address: 'St. Peters Tech Campus, Bangalore',
    venue_link: null,
    banner_url: '/DSC00912.JPG',
    gallery_urls: ['/DSC00912.JPG', '/DSC00915.JPG', '/DSC00931.JPG'],
    rules_text: 'Participants must be full-time students. Teams of 2-4 members. All code must be written during the event.',
    rules_doc_url: null,
    prize_pool: 100000,
    prize_details: '1st: ₹50,000 | 2nd: ₹30,000 | 3rd: ₹20,000',
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'Web Development Workshop',
    slug: 'web-dev-workshop-2026',
    category: 'workshop',
    description: 'Master modern web technologies including React, Node.js, and deployment strategies. Perfect for beginners and intermediate developers.',
    status: 'published',
    start_date: '2026-02-20T14:00:00Z',
    end_date: '2026-02-20T18:00:00Z',
    registration_deadline: '2026-02-18T23:59:59Z',
    venue_type: 'hybrid',
    venue_address: 'InnoTech Hub Main Campus',
    venue_link: 'https://meet.google.com/abc-defg-hij',
    banner_url: '/DSC00949.JPG',
    gallery_urls: ['/DSC00949.JPG', '/DSC00984.JPG'],
    rules_text: 'Bring your own laptop. Prerequisites: basic HTML/CSS knowledge.',
    rules_doc_url: null,
    prize_pool: null,
    prize_details: null,
    payment_required: true,
    payment_amount: 299,
    payment_instructions: 'Pay via UPI to ithhub@bank or use the payment link sent via email.',
  },
  {
    name: 'AI & Machine Learning Summit',
    slug: 'ai-ml-summit-2026',
    category: 'seminar',
    description: 'Deep dive into AI and ML with industry experts. Learn about neural networks, NLP, computer vision, and real-world applications.',
    status: 'published',
    start_date: '2026-03-22T10:00:00Z',
    end_date: '2026-03-22T16:00:00Z',
    registration_deadline: '2026-03-20T23:59:59Z',
    venue_type: 'online',
    venue_address: null,
    venue_link: 'https://zoom.us/meeting/ith-ai-ml-summit-2026',
    banner_url: '/DSC01006.JPG',
    gallery_urls: ['/DSC01006.JPG', '/DSC01035.JPG'],
    rules_text: 'Open to all students. Attendance certificate provided.',
    rules_doc_url: null,
    prize_pool: null,
    prize_details: null,
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'Startup Pitch Competition',
    slug: 'startup-pitch-competition-2026',
    category: 'competition',
    description: 'Showcase your innovative startup ideas to investors and judges. Get feedback and potential funding opportunities.',
    status: 'published',
    start_date: '2026-04-05T18:00:00Z',
    end_date: '2026-04-05T21:00:00Z',
    registration_deadline: '2026-04-01T23:59:59Z',
    venue_type: 'offline',
    venue_address: 'InnoTech Hub Auditorium',
    venue_link: null,
    banner_url: '/DSC01224.JPG',
    gallery_urls: ['/DSC01224.JPG', '/DSC01231.JPG'],
    rules_text: 'Each team gets 5 minutes to pitch. Maximum 3 founders per team.',
    rules_doc_url: null,
    prize_pool: 500000,
    prize_details: 'Winner: ₹250,000 | Runner-up: ₹150,000 | 3rd: ₹100,000',
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'Code Challenge by Hack2Skills',
    slug: 'hack2skills-code-challenge-2026',
    category: 'competition',
    description: 'Competitive programming challenge featuring algorithmic problems. Compete globally and win prizes.',
    status: 'published',
    start_date: '2026-02-28T12:00:00Z',
    end_date: '2026-02-28T16:00:00Z',
    registration_deadline: '2026-02-27T23:59:59Z',
    venue_type: 'online',
    venue_address: null,
    venue_link: 'https://hack2skills.com/contest/ith-2026',
    banner_url: '/hack2skills.png',
    gallery_urls: ['/hack2skills.png'],
    rules_text: 'Individual entries only. Judged on correctness and efficiency.',
    rules_doc_url: null,
    prize_pool: 50000,
    prize_details: '1st: ₹25,000 | 2nd: ₹15,000 | 3rd: ₹10,000',
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'GeeksforGeeks Masterclass',
    slug: 'geeksforgeeks-masterclass-2026',
    category: 'workshop',
    description: 'Learn from GeeksforGeeks experts. Topics cover DSA, system design, and interview preparation.',
    status: 'published',
    start_date: '2026-03-08T11:00:00Z',
    end_date: '2026-03-08T13:00:00Z',
    registration_deadline: '2026-03-07T23:59:59Z',
    venue_type: 'online',
    venue_address: null,
    venue_link: 'https://geeksforgeeks.org/ith-masterclass',
    banner_url: '/geeksforgeeks.png',
    gallery_urls: ['/geeksforgeeks.png'],
    rules_text: 'Free for all students. Registration required.',
    rules_doc_url: null,
    prize_pool: null,
    prize_details: null,
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  {
    name: 'Gemini AI Workshop',
    slug: 'gemini-ai-workshop-2026',
    category: 'workshop',
    description: 'Explore Google Gemini API and build AI-powered applications. Hands-on coding session with real-world examples.',
    status: 'published',
    start_date: '2026-04-12T15:00:00Z',
    end_date: '2026-04-12T17:00:00Z',
    registration_deadline: '2026-04-10T23:59:59Z',
    venue_type: 'hybrid',
    venue_address: 'Tech Lab, InnoTech Hub',
    venue_link: 'https://meet.google.com/gemini-workshop',
    banner_url: '/gemini.png',
    gallery_urls: ['/gemini.png'],
    rules_text: 'Intermediate level. Bring Google Cloud account.',
    rules_doc_url: null,
    prize_pool: null,
    prize_details: null,
    payment_required: false,
    payment_amount: null,
    payment_instructions: null,
  },
  // Past events
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
];

async function seedEvents() {
  try {
    console.log('🌱 Starting event seeding...\n');
    
    // Check if events already exist
    const { data: existingEvents, error: checkError } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (checkError) {
      throw new Error(`Failed to check existing events: ${checkError.message}`);
    }
    
    if (existingEvents && existingEvents.length > 0) {
      console.log('✅ Events already exist in database. Skipping seed.\n');
      return;
    }
    
    // Insert sample events
    const { data, error } = await supabase
      .from('events')
      .insert(SAMPLE_EVENTS)
      .select();
    
    if (error) {
      throw new Error(`Failed to insert events: ${error.message}`);
    }
    
    console.log(`✅ Successfully seeded ${data?.length || 0} events!\n`);
    console.log('📊 Events added:\n');
    data?.forEach((event) => {
      console.log(`  ✓ ${event.name} (${event.status})`);
    });
    console.log('');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedEvents().then(() => {
  process.exit(0);
});
