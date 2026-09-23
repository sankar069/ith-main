import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../_lib/auth.js';

export default withAdminHandler(['GET', 'PUT'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw new AuthError(error.message, 500);

    const settings = {};
    for (const row of data || []) settings[row.key] = row.value;
    sendJson(res, 200, { settings });
    return;
  }

  const { settings } = req.body || {};
  if (!settings || typeof settings !== 'object') {
    throw new AuthError('Body must include a "settings" object of key/value pairs.', 400);
  }

  const rows = Object.entries(settings).map(([key, value]) => ({ key, value: value === '' ? null : value }));
  if (rows.length === 0) {
    sendJson(res, 200, { settings: {} });
    return;
  }

  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, { settings });
});
