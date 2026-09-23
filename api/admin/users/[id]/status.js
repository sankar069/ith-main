import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

const VALID_STATUSES = ['active', 'deactivated', 'banned'];

export default withAdminHandler(['PATCH'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id } = req.query;
  const { status } = req.body || {};

  if (!id) throw new AuthError('Missing user id.', 400);
  if (!VALID_STATUSES.includes(status)) {
    throw new AuthError(`Status must be one of: ${VALID_STATUSES.join(', ')}.`, 422);
  }

  const { data, error } = await supabase.from('users').update({ status }).eq('id', id).select().single();
  if (error) throw new AuthError(error.message, 500);
  if (!data) throw new AuthError('User not found.', 404);

  sendJson(res, 200, { user: data });
});
