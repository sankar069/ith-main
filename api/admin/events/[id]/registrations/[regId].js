import { getSupabaseAdmin } from '../../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../../_lib/auth.js';

const VALID_STATUSES = ['pending', 'submitted', 'approved', 'rejected', 'not_required'];

export default withAdminHandler(['PATCH'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id, regId } = req.query;
  const { payment_status } = req.body || {};

  if (!id || !regId) throw new AuthError('Missing event id or registration id.', 400);
  if (!VALID_STATUSES.includes(payment_status)) {
    throw new AuthError(`payment_status must be one of: ${VALID_STATUSES.join(', ')}.`, 422);
  }

  const { data, error } = await supabase
    .from('event_registrations')
    .update({ payment_status })
    .eq('id', regId)
    .eq('event_id', id)
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);
  if (!data) throw new AuthError('Registration not found.', 404);

  sendJson(res, 200, { registration: data });
});
