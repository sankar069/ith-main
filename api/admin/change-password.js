import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../_lib/auth.js';
import { changeAdminPassword } from '../_lib/adminAuth.js';

export default withAdminHandler(['POST'], async (req, res) => {
  const payload = requireAdminAuth(req);
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    throw new AuthError('Current and new password are required.', 400);
  }

  const supabase = getSupabaseAdmin();
  try {
    await changeAdminPassword(supabase, payload.email, currentPassword, newPassword);
  } catch (err) {
    throw new AuthError(err.message, err.status || 500);
  }

  sendJson(res, 200, { success: true });
});
