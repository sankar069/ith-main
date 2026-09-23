import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

export default withAdminHandler(['GET', 'POST'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('sponsors').select('*').order('sort_order', { ascending: true });
    if (error) throw new AuthError(error.message, 500);
    sendJson(res, 200, { sponsors: data || [] });
    return;
  }

  const body = req.body || {};
  if (!body.name || !body.name.trim()) throw new AuthError('Sponsor name is required.', 422);

  const { data: existing } = await supabase.from('sponsors').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const nextSortOrder = existing && existing[0] ? existing[0].sort_order + 1 : 0;

  const { data, error } = await supabase
    .from('sponsors')
    .insert({
      name: body.name.trim(),
      logo_url: body.logo_url || null,
      website_link: body.website_link || null,
      category: body.category || null,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);
  sendJson(res, 201, { sponsor: data });
});
