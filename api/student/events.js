import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';
import { requireStudentAuth } from './_lib/studentAuth.js';

export default withApiHandler(['GET'], async (req, res) => {
  const { profile } = await requireStudentAuth(req);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('event_registrations')
    .select('*, event:events(id, name, slug, status, start_date, end_date, venue_type, venue_address, venue_link, banner_url, payment_required, payment_amount), pass:event_passes(id, name, price)')
    .eq('user_id', profile.id)
    .order('registered_at', { ascending: false });

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, { registrations: data || [] });
});
