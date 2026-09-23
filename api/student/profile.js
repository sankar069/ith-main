import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';
import { requireStudentAuth } from './_lib/studentAuth.js';
import { validateInput, studentProfileUpdateSchema } from '../_lib/validation.js';

const EDITABLE_FIELDS = ['full_name', 'phone', 'college', 'graduation_year', 'profile_public'];

export default withApiHandler(['GET', 'PUT'], async (req, res) => {
  const { profile } = await requireStudentAuth(req);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    sendJson(res, 200, { profile });
    return;
  }

  // SECURITY: Validate input with Zod
  const body = validateInput(studentProfileUpdateSchema, req.body || {}, 'Profile update validation error');

  if (body.full_name !== undefined && !body.full_name.trim()) {
    throw new AuthError('Full name cannot be empty.', 422);
  }

  const updatePayload = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) updatePayload[field] = body[field];
  }
  if (updatePayload.graduation_year !== undefined && updatePayload.graduation_year !== null) {
    updatePayload.graduation_year = Number(updatePayload.graduation_year);
  }

  const { data, error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, { profile: data });
});
