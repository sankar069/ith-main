/**
 * Health check endpoint for monitoring
 * Returns application health status without exposing sensitive information
 */

import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const startTime = Date.now();
  const checks = {
    api: 'ok',
    database: 'checking',
    timestamp: new Date().toISOString(),
  };

  try {
    // Basic database connectivity check
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('events')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (error) {
      checks.database = 'error';
      checks.healthy = false;
    } else {
      checks.database = 'ok';
      checks.healthy = true;
    }
  } catch (err) {
    checks.database = 'error';
    checks.healthy = false;
  }

  const responseTime = Date.now() - startTime;
  checks.responseTime = `${responseTime}ms`;

  // Return 200 if healthy, 503 if not
  const statusCode = checks.healthy ? 200 : 503;

  res.status(statusCode).json(checks);
}
