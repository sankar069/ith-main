import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';

// Public, unauthenticated — single published event for the student event
// detail view. 404s for drafts/completed the same as a missing slug so this
// never leaks unpublished event content.
export default withApiHandler(['GET'], async (req, res) => {
  const supabase = getSupabaseAdmin();
  const { slug } = req.query;

  if (!slug) throw new AuthError('Missing event slug.', 400);

  const { data, error } = await supabase
    .from('events')
    .select('*, event_registrations(count), event_passes(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw new AuthError(error.message, 500);
  if (!data) throw new AuthError('Event not found.', 404);

  const passes = (data.event_passes || []).sort((a, b) => a.sort_order - b.sort_order);

  sendJson(res, 200, {
    event: {
      ...data,
      total_registered: data.event_registrations?.[0]?.count ?? 0,
      event_registrations: undefined,
      event_passes: undefined,
      passes,
    },
  });
});
