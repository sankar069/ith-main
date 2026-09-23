import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from './_lib/auth.js';

// Public, unauthenticated — the Roadmap section's feature tracker reads this.
export default withApiHandler(['GET'], async (req, res) => {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, { items: data || [] });
});
