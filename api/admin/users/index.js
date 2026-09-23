import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../_lib/auth.js';

export default withAdminHandler(['GET'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, { users: data || [] });
});
