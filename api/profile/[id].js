import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';

// Public, unauthenticated — the shareable Innovator Profile page. Only ever
// returns data for students who have explicitly opted in via
// Settings -> Public Profile (profile_public = true); everyone else gets a
// 404 indistinguishable from "no such user" so this never leaks who exists.
export default withApiHandler(['GET'], async (req, res) => {
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id) throw new AuthError('Missing profile id.', 400);

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, full_name, college, graduation_year, profile_public')
    .eq('id', id)
    .maybeSingle();
  if (userError) throw new AuthError(userError.message, 500);
  if (!user || !user.profile_public) throw new AuthError('Profile not found.', 404);

  const [{ data: certificates, error: certError }, { data: registrations, error: regError }, { data: projects, error: projError }] = await Promise.all([
    supabase.from('certificates').select('id, title, issuer, skills, earned_date, event_id').eq('user_id', id).eq('status', 'earned'),
    supabase.from('event_registrations').select('id').eq('user_id', id),
    supabase.from('projects').select('id, stage').eq('user_id', id),
  ]);
  if (certError) throw new AuthError(certError.message, 500);
  if (regError) throw new AuthError(regError.message, 500);
  if (projError) throw new AuthError(projError.message, 500);

  sendJson(res, 200, {
    profile: {
      id: user.id,
      full_name: user.full_name,
      college: user.college,
      graduation_year: user.graduation_year,
    },
    stats: {
      eventsRegistered: (registrations || []).length,
      certificatesEarned: (certificates || []).length,
      projectsSubmitted: (projects || []).filter((p) => p.stage === 'submitted').length,
    },
    certificates: certificates || [],
  });
});
