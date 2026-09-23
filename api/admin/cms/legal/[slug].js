import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

const VALID_SLUGS = ['privacy-policy', 'terms-conditions', 'platform-rules'];

export default withAdminHandler(['GET', 'PUT'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { slug } = req.query;

  if (!VALID_SLUGS.includes(slug)) {
    throw new AuthError(`Unknown legal page slug. Expected one of: ${VALID_SLUGS.join(', ')}.`, 400);
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('legal_pages').select('*').eq('slug', slug).maybeSingle();
    if (error) throw new AuthError(error.message, 500);
    if (!data) throw new AuthError('Legal page not found.', 404);
    sendJson(res, 200, { page: data });
    return;
  }

  const { content_html, title } = req.body || {};
  if (typeof content_html !== 'string') throw new AuthError('content_html is required.', 422);

  const updatePayload = { content_html };
  if (title !== undefined) updatePayload.title = title;

  const { data, error } = await supabase.from('legal_pages').update(updatePayload).eq('slug', slug).select().single();
  if (error) throw new AuthError(error.message, 500);
  if (!data) throw new AuthError('Legal page not found.', 404);

  sendJson(res, 200, { page: data });
});
