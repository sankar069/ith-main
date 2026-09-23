import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';

// Public, unauthenticated — lists events for the student "Explore Events"
// browser and public marketing pages. Mirrors the admin list shape minus
// nothing sensitive; the events table doesn't hold anything admin-only.
//
// Defaults to status = 'published' (RLS scopes direct anon reads the same
// way as a second layer). An optional ?status= lets a caller ask for
// 'completed' instead — e.g. a public "Past Events" showcase — but never
// 'draft', which stays admin-only. Every existing caller omits the param,
// so this is purely additive.
const ALLOWED_PUBLIC_STATUSES = new Set(['published', 'completed']);

export default withApiHandler(['GET'], async (req, res) => {
  const supabase = getSupabaseAdmin();

  const requestedStatus = req.query?.status;
  const status = ALLOWED_PUBLIC_STATUSES.has(requestedStatus) ? requestedStatus : 'published';

  const { data, error } = await supabase
    .from('events')
    .select('*, event_registrations(count), event_passes(*)')
    .eq('status', status)
    .order('start_date', { ascending: true, nullsFirst: false });

  if (error) throw new AuthError(error.message, 500);

  const events = (data || []).map((row) => ({
    ...row,
    total_registered: row.event_registrations?.[0]?.count ?? 0,
    event_registrations: undefined,
    event_passes: undefined,
    passes: (row.event_passes || []).sort((a, b) => a.sort_order - b.sort_order),
  }));

  sendJson(res, 200, { events });
});
