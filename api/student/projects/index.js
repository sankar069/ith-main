import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../../_lib/auth.js';
import { requireStudentAuth } from '../_lib/studentAuth.js';

const STAGES = ['ideation', 'team_formation', 'github_linked', 'submitted'];

export default withApiHandler(['GET', 'POST'], async (req, res) => {
  const { profile } = await requireStudentAuth(req);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    if (error) throw new AuthError(error.message, 500);
    sendJson(res, 200, { projects: data || [] });
    return;
  }

  // POST — start a new project at the "ideation" stage.
  const body = req.body || {};
  if (!body.title || !body.title.trim()) {
    throw new AuthError('Project title is required.', 422);
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: profile.id,
      title: body.title.trim(),
      description: body.description || null,
      stage: 'ideation',
    })
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);
  sendJson(res, 201, { project: data });
});

export { STAGES };
