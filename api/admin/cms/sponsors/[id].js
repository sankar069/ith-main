import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

const EDITABLE_FIELDS = ['name', 'logo_url', 'website_link', 'category', 'sort_order'];

export default withAdminHandler(['PUT', 'DELETE'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id) throw new AuthError('Missing sponsor id.', 400);

  if (req.method === 'PUT') {
    const body = req.body || {};
    const updatePayload = {};
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) updatePayload[field] = body[field];
    }
    if (updatePayload.name !== undefined && !updatePayload.name.trim()) {
      throw new AuthError('Sponsor name is required.', 422);
    }

    const { data, error } = await supabase.from('sponsors').update(updatePayload).eq('id', id).select().single();
    if (error) throw new AuthError(error.message, 500);
    if (!data) throw new AuthError('Sponsor not found.', 404);

    sendJson(res, 200, { sponsor: data });
    return;
  }

  const { error, count } = await supabase.from('sponsors').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AuthError(error.message, 500);
  if (!count) throw new AuthError('Sponsor not found.', 404);

  sendJson(res, 200, { success: true });
});
