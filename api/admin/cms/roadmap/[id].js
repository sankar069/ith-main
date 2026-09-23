import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

const VALID_STATUSES = ['planning', 'in_progress', 'completed'];
const EDITABLE_FIELDS = ['feature_name', 'status', 'target_date', 'sort_order'];

export default withAdminHandler(['PUT', 'DELETE'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id) throw new AuthError('Missing roadmap item id.', 400);

  if (req.method === 'PUT') {
    const body = req.body || {};
    if (body.status && !VALID_STATUSES.includes(body.status)) throw new AuthError('Invalid status.', 422);
    if (body.feature_name !== undefined && !body.feature_name.trim()) {
      throw new AuthError('Feature name is required.', 422);
    }

    const updatePayload = {};
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) updatePayload[field] = body[field];
    }

    const { data, error } = await supabase.from('roadmap_items').update(updatePayload).eq('id', id).select().single();
    if (error) throw new AuthError(error.message, 500);
    if (!data) throw new AuthError('Roadmap item not found.', 404);

    sendJson(res, 200, { item: data });
    return;
  }

  const { error, count } = await supabase.from('roadmap_items').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AuthError(error.message, 500);
  if (!count) throw new AuthError('Roadmap item not found.', 404);

  sendJson(res, 200, { success: true });
});
