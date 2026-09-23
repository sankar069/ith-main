import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { AuthError } from '../../_lib/auth.js';

/**
 * Verifies the Supabase-issued access token from the Authorization header
 * and resolves the matching public.users profile row (auto-provisioned by
 * the on_auth_user_created trigger at sign-up).
 *
 * Returns { authUser, profile }. Throws AuthError on any failure.
 */
export async function requireStudentAuth(req) {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AuthError('Missing session token.', 401);
  }
  const token = header.slice('Bearer '.length).trim();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    throw new AuthError('Invalid or expired session. Please log in again.', 401);
  }
  const authUser = data.user;

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUser.id)
    .maybeSingle();

  if (profileError) throw new AuthError(profileError.message, 500);
  if (!profile) {
    throw new AuthError(
      'No student profile found for this account yet. Try signing out and back in.',
      404
    );
  }
  if (profile.status === 'banned') {
    throw new AuthError('This account has been banned.', 403);
  }
  if (profile.status === 'deactivated') {
    throw new AuthError('This account is deactivated. Contact support to reactivate it.', 403);
  }

  return { authUser, profile };
}
