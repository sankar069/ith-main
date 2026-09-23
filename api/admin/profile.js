import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../_lib/auth.js';

export default withAdminHandler(['GET', 'PUT'], async (req, res) => {
  const payload = requireAdminAuth(req);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('admins').select('*').eq('email', payload.email).maybeSingle();
    if (error) throw new AuthError(error.message, 500);
    if (!data) throw new AuthError('Admin profile not found.', 404);

    sendJson(res, 200, {
      profile: {
        email: data.email,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        role: data.role,
      },
    });
    return;
  }

  const { display_name, email, avatar_url } = req.body || {};
  if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email)) {
    throw new AuthError('Enter a valid email address.', 422);
  }

  const updatePayload = {};
  if (display_name !== undefined) updatePayload.display_name = display_name;
  if (avatar_url !== undefined) updatePayload.avatar_url = avatar_url;
  if (email !== undefined) updatePayload.email = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('admins')
    .update(updatePayload)
    .eq('email', payload.email)
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 200, {
    profile: { email: data.email, display_name: data.display_name, avatar_url: data.avatar_url, role: data.role },
    // Client should re-login if the email changed, since the current JWT
    // still carries the old email claim for the rest of this session.
    emailChanged: email !== undefined && email.trim().toLowerCase() !== payload.email,
  });
});
