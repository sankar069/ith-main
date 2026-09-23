import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from './_lib/auth.js';

// Public, unauthenticated — hero video URL, promo banner, Discord/WhatsApp
// links, etc. Components should treat a missing key as "use the built-in
// default" rather than showing nothing.
export default withApiHandler(['GET'], async (req, res) => {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw new AuthError(error.message, 500);

  const settings = {};
  for (const row of data || []) settings[row.key] = row.value;

  sendJson(res, 200, { settings });
});
