import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';
import { requireStudentAuth } from './_lib/studentAuth.js';

export default withApiHandler(['GET'], async (req, res) => {
  const { profile } = await requireStudentAuth(req);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('certificates')
    .select('*, event:events(id, name)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, { certificates: data || [] });
});
