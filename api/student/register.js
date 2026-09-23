import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';
import { requireStudentAuth } from './_lib/studentAuth.js';

export default withApiHandler(['POST'], async (req, res) => {
  const { profile } = await requireStudentAuth(req);
  const supabase = getSupabaseAdmin();
  const body = req.body || {};

  const eventId = body.event_id;
  if (!eventId) throw new AuthError('Missing event_id.', 400);
  if (!body.student_name || !body.student_name.trim()) {
    throw new AuthError('Full name is required.', 422);
  }

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, name, status, registration_deadline, payment_required, event_passes(*)')
    .eq('id', eventId)
    .maybeSingle();
  if (eventError) throw new AuthError(eventError.message, 500);
  if (!event || event.status !== 'published') {
    throw new AuthError('This event is not open for registration.', 404);
  }
  if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
    throw new AuthError('Registration for this event has closed.', 422);
  }

  const { data: existing, error: existingError } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', profile.id)
    .maybeSingle();
  if (existingError) throw new AuthError(existingError.message, 500);
  if (existing) throw new AuthError('You have already registered for this event.', 409);

  const passes = event.event_passes || [];
  const usesPasses = passes.length > 0;

  // Passes model: student must pick a valid tier; its price decides whether
  // payment is required. Flat model: fall back to events.payment_required.
  let selectedPass = null;
  let paymentRequired = event.payment_required;

  if (usesPasses) {
    if (!body.pass_id) throw new AuthError('Please select a pass to continue.', 422);
    selectedPass = passes.find((p) => p.id === body.pass_id);
    if (!selectedPass) throw new AuthError('Selected pass is not valid for this event.', 422);

    if (selectedPass.capacity !== null) {
      const { count, error: countError } = await supabase
        .from('event_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('pass_id', selectedPass.id);
      if (countError) throw new AuthError(countError.message, 500);
      if ((count || 0) >= selectedPass.capacity) {
        throw new AuthError(`"${selectedPass.name}" is sold out.`, 409);
      }
    }

    paymentRequired = Number(selectedPass.price) > 0;
  }

  if (paymentRequired && !body.payment_proof_url) {
    throw new AuthError('Payment proof is required to complete registration.', 422);
  }

  const paymentStatus = !paymentRequired
    ? 'not_required'
    : body.payment_proof_url
      ? 'submitted'
      : 'pending';

  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: profile.id,
      pass_id: selectedPass?.id || null,
      student_name: body.student_name.trim(),
      student_email: profile.email,
      student_phone: body.student_phone || null,
      college: body.college || null,
      team_name: body.team_name || null,
      payment_status: paymentStatus,
      payment_proof_url: body.payment_proof_url || null,
    })
    .select()
    .single();

  if (error) throw new AuthError(error.message, 500);

  sendJson(res, 201, { registration: data });
});
