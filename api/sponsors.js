import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from './_lib/auth.js';

// Public, unauthenticated — the Partners & Sponsors section reads this
// directly. RLS also allows anon reads on this table (see schema-phase2.sql).
export default withApiHandler(['GET'], async (req, res) => {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, { sponsors: data || [] });
});
