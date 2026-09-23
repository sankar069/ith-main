import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

const VALID_STATUSES = ['planning', 'in_progress', 'completed'];

export default withAdminHandler(['GET', 'POST'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('roadmap_items').select('*').order('sort_order', { ascending: true });
    if (error) throw new AuthError(error.message, 500);
    sendJson(res, 200, { items: data || [] });
    return;
  }

  const body = req.body || {};
  if (!body.feature_name || !body.feature_name.trim()) throw new AuthError('Feature name is required.', 422);
  if (body.status && !VALID_STATUSES.includes(body.status)) throw new AuthError('Invalid status.', 422);

  const { data: existing } = await supabase.from('roadmap_items').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const nextSortOrder = existing && existing[0] ? existing[0].sort_order + 1 : 0;

  const { data, error } = await supabase
    .from('roadmap_items')
    .insert({
      feature_name: body.feature_name.trim(),
      status: body.status || 'planning',
      target_date: body.target_date || null,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);
  sendJson(res, 201, { item: data });
});
