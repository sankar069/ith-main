import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, requireSuperAdmin, sendJson, AuthError } from '../../_lib/auth.js';

const EDITABLE_FIELDS = ['full_name', 'email', 'phone', 'college', 'graduation_year'];

export default withAdminHandler(['PUT', 'DELETE'], async (req, res) => {
  const admin = requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id) throw new AuthError('Missing user id.', 400);

  if (req.method === 'PUT') {
    const body = req.body || {};
    if (body.full_name !== undefined && !body.full_name.trim()) {
      throw new AuthError('Full name is required.', 422);
    }
    if (body.email !== undefined && !/^\S+@\S+\.\S+$/.test(body.email)) {
      throw new AuthError('Enter a valid email address.', 422);
    }

    const updatePayload = {};
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) updatePayload[field] = body[field];
    }
    if (updatePayload.graduation_year !== undefined && updatePayload.graduation_year !== null) {
      updatePayload.graduation_year = Number(updatePayload.graduation_year);
    }

    const { data, error } = await supabase.from('users').update(updatePayload).eq('id', id).select().single();
    if (error) throw new AuthError(error.message, 500);
    if (!data) throw new AuthError('User not found.', 404);

    sendJson(res, 200, { user: data });
    return;
  }

  // DELETE — Super Admin only, destructive
  requireSuperAdmin(admin);

  const { data: existing, error: fetchError } = await supabase
    .from('users')
    .select('id, auth_user_id')
    .eq('id', id)
    .maybeSingle();
  if (fetchError) throw new AuthError(fetchError.message, 500);
  if (!existing) throw new AuthError('User not found.', 404);

  if (existing.auth_user_id) {
    // Deleting the auth account cascades to the public.users profile row
    // (auth_user_id has on delete cascade) — this also revokes their ability
    // to log in, which deleting only the profile row would not do.
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(existing.auth_user_id);
    if (authDeleteError) throw new AuthError(authDeleteError.message, 500);
  } else {
    // No linked auth account (e.g. seed/sample data) — just remove the profile.
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw new AuthError(error.message, 500);
  }

  sendJson(res, 200, { success: true });
});
