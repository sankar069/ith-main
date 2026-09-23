import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, requireSuperAdmin, sendJson, AuthError } from '../../_lib/auth.js';

const VALID_ROLES = ['super_admin', 'event_manager'];

export default withAdminHandler(['GET', 'POST'], async (req, res) => {
  const admin = requireAdminAuth(req);
  requireSuperAdmin(admin);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, display_name, role, status, created_at')
      .order('created_at', { ascending: true });
    if (error) throw new AuthError(error.message, 500);
    sendJson(res, 200, { team: data || [] });
    return;
  }

  const { email, role } = req.body || {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new AuthError('Enter a valid email address.', 422);
  if (!VALID_ROLES.includes(role)) throw new AuthError('Role must be super_admin or event_manager.', 422);

  const { data, error } = await supabase
    .from('admins')
    .insert({ email: email.trim().toLowerCase(), role, status: 'invited' })
    .select('id, email, display_name, role, status, created_at')
    .single();

  if (error) {
    if (error.code === '23505') throw new AuthError('An admin with this email already exists.', 409);
    throw new AuthError(error.message, 500);
  }

  sendJson(res, 201, { member: data });
});
