import { getSupabaseAdmin } from '../../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../../_lib/auth.js';

function toCsvValue(value) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function buildCsv(rows) {
  const headers = ['Name', 'Email', 'Phone', 'College', 'Team', 'Payment Status', 'Registered At'];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.student_name,
        r.student_email,
        r.student_phone,
        r.college,
        r.team_name,
        r.payment_status,
        r.registered_at,
      ]
        .map(toCsvValue)
        .join(',')
    );
  }
  return lines.join('\n');
}

export default withAdminHandler(['GET'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id, format } = req.query;

  if (!id) throw new AuthError('Missing event id.', 400);

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, name, slug')
    .eq('id', id)
    .maybeSingle();
  if (eventError) throw new AuthError(eventError.message, 500);
  if (!event) throw new AuthError('Event not found.', 404);

  const { data: registrations, error } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', id)
    .order('registered_at', { ascending: false });
  if (error) throw new AuthError(error.message, 500);

  if (format === 'csv') {
    const csv = buildCsv(registrations || []);
    res.status(200);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${event.slug || 'event'}-registrations.csv"`);
    res.send(csv);
    return;
  }

  sendJson(res, 200, { event, registrations: registrations || [] });
});
