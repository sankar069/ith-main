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

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log(`📍 URL: ${SUPABASE_URL}`);
console.log(`🔑 Key: ${SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing'}\n`);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function testConnection() {
  try {
    console.log('⏳ Attempting to connect to Supabase...\n');
    
    // Try a simple query
    const { data, error } = await supabase
      .from('events')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database Error:', error.message);
      console.error('\n💡 Possible issues:');
      console.error('   - Supabase project is paused (need to unpause in dashboard)');
      console.error('   - Wrong credentials in .env');
      console.error('   - Table "events" does not exist');
      console.error('   - Network connectivity issue\n');
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log(`📊 Events table exists and is accessible\n`);
    
    // Try to get actual count
    const { count, error: countError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`📈 Current events in database: ${count || 0}\n`);
    }
    
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    console.error('\n💡 This usually means:');
    console.error('   - Your Supabase project is PAUSED');
    console.error('   - Visit: https://supabase.com/dashboard/project/fblwlpkgvzqctjzwcmcx');
    console.error('   - Click "Restore" or "Unpause" to activate your project\n');
    process.exit(1);
  }
}

testConnection();
