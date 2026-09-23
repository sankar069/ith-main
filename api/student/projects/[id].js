import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../../_lib/auth.js';
import { requireStudentAuth } from '../_lib/studentAuth.js';

const STAGES = ['ideation', 'team_formation', 'github_linked', 'submitted'];
const EDITABLE_FIELDS = ['title', 'description', 'stage', 'team_members', 'github_url', 'live_url', 'skills'];

export default withApiHandler(['PUT', 'DELETE'], async (req, res) => {
  const { profile } = await requireStudentAuth(req);
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id) throw new AuthError('Missing project id.', 400);

  if (req.method === 'DELETE') {
    const { error, count } = await supabase
      .from('projects')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', profile.id);
    if (error) throw new AuthError(error.message, 500);
    if (!count) throw new AuthError('Project not found.', 404);
    sendJson(res, 200, { success: true });
    return;
  }

  // PUT — update any editable field, including moving to the next stage.
  const body = req.body || {};
  if (body.stage !== undefined && !STAGES.includes(body.stage)) {
    throw new AuthError(`Stage must be one of: ${STAGES.join(', ')}.`, 422);
  }
  if (body.title !== undefined && !body.title.trim()) {
    throw new AuthError('Project title cannot be empty.', 422);
  }

  const updatePayload = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) updatePayload[field] = body[field];
  }
  if (updatePayload.title) updatePayload.title = updatePayload.title.trim();

  const { data, error } = await supabase
    .from('projects')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', profile.id)
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);
  if (!data) throw new AuthError('Project not found.', 404);

  sendJson(res, 200, { project: data });
});
