import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';

// Public, unauthenticated — Privacy Policy / Terms / Platform Rules pages
// read their content_html from here.
export default withApiHandler(['GET'], async (req, res) => {
  const supabase = getSupabaseAdmin();
  const { slug } = req.query;

  if (!slug) throw new AuthError('Missing page slug.', 400);

  const { data, error } = await supabase
    .from('legal_pages')
    .select('slug, title, content_html, updated_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new AuthError(error.message, 500);
  if (!data) throw new AuthError('Page not found.', 404);

  sendJson(res, 200, { page: data });
});
