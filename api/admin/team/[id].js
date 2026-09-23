import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, requireSuperAdmin, sendJson, AuthError } from '../../_lib/auth.js';

export default withAdminHandler(['DELETE'], async (req, res) => {
  const admin = requireAdminAuth(req);
  requireSuperAdmin(admin);
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id) throw new AuthError('Missing team member id.', 400);

  const { data: target, error: fetchError } = await supabase.from('admins').select('email').eq('id', id).maybeSingle();
  if (fetchError) throw new AuthError(fetchError.message, 500);
  if (!target) throw new AuthError('Team member not found.', 404);
  if (target.email === admin.email) throw new AuthError('You cannot remove your own account.', 400);

  const { error, count } = await supabase.from('admins').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AuthError(error.message, 500);
  if (!count) throw new AuthError('Team member not found.', 404);

  sendJson(res, 200, { success: true });
});
