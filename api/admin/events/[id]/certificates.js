import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

export default withAdminHandler(['GET', 'POST'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id: eventId } = req.query;

  if (!eventId) throw new AuthError('Missing event id.', 400);

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('event_id', eventId);
    if (error) throw new AuthError(error.message, 500);
    sendJson(res, 200, { certificates: data || [] });
    return;
  }

  // POST — issue a certificate to one or more registrants of this event.
  const body = req.body || {};
  const { registration_ids, title, issuer, certificate_url, skills } = body;
  const skillsArray = Array.isArray(skills) ? skills.filter(Boolean) : [];

  if (!Array.isArray(registration_ids) || registration_ids.length === 0) {
    throw new AuthError('Select at least one registrant to issue a certificate to.', 422);
  }
  if (!title || !title.trim()) {
    throw new AuthError('Certificate title is required.', 422);
  }

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, name')
    .eq('id', eventId)
    .maybeSingle();
  if (eventError) throw new AuthError(eventError.message, 500);
  if (!event) throw new AuthError('Event not found.', 404);

  const { data: registrations, error: regError } = await supabase
    .from('event_registrations')
    .select('id, user_id, student_name')
    .eq('event_id', eventId)
    .in('id', registration_ids);
  if (regError) throw new AuthError(regError.message, 500);

  const withAccount = registrations.filter((r) => r.user_id);
  if (withAccount.length === 0) {
    throw new AuthError('None of the selected registrants have a linked student account.', 422);
  }

  // Skip anyone who already has a certificate for this event.
  const { data: existing, error: existingError } = await supabase
    .from('certificates')
    .select('user_id')
    .eq('event_id', eventId)
    .in('user_id', withAccount.map((r) => r.user_id));
  if (existingError) throw new AuthError(existingError.message, 500);
  const alreadyIssued = new Set((existing || []).map((c) => c.user_id));

  const toInsert = withAccount
    .filter((r) => !alreadyIssued.has(r.user_id))
    .map((r) => ({
      user_id: r.user_id,
      event_id: eventId,
      title: title.trim(),
      issuer: issuer?.trim() || 'InnoTech-Hub',
      certificate_url: certificate_url || null,
      skills: skillsArray,
      status: 'earned',
      earned_date: new Date().toISOString().slice(0, 10),
    }));

  let inserted = [];
  if (toInsert.length > 0) {
    const { data, error } = await supabase.from('certificates').insert(toInsert).select();
    if (error) throw new AuthError(error.message, 500);
    inserted = data;
  }

  sendJson(res, 201, {
    issued: inserted.length,
    skipped: withAccount.length - inserted.length,
    certificates: inserted,
  });
});
