import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, requireSuperAdmin, sendJson, AuthError } from '../../_lib/auth.js';
import { validateEventPayload, replacePasses } from './index.js';

export default withAdminHandler(['GET', 'PUT', 'DELETE'], async (req, res) => {
  const admin = requireAdminAuth(req);
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id) throw new AuthError('Missing event id.', 400);

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('events')
      .select('*, event_registrations(count), event_passes(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new AuthError(error.message, 500);
    if (!data) throw new AuthError('Event not found.', 404);

    const passes = (data.event_passes || []).sort((a, b) => a.sort_order - b.sort_order);

    sendJson(res, 200, {
      event: {
        ...data,
        total_registered: data.event_registrations?.[0]?.count ?? 0,
        event_registrations: undefined,
        event_passes: undefined,
        passes,
      },
    });
    return;
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    validateEventPayload(body, { partial: true });

    const updatePayload = {};
    const fields = [
      'name', 'category', 'description', 'status', 'start_date', 'end_date',
      'registration_deadline', 'venue_type', 'venue_address', 'venue_link',
      'banner_url', 'gallery_urls', 'rules_text', 'rules_doc_url', 'prize_pool',
      'prize_details', 'payment_required', 'payment_amount', 'payment_instructions',
    ];
    for (const field of fields) {
      if (body[field] !== undefined) updatePayload[field] = body[field];
    }
    if (updatePayload.name) updatePayload.name = updatePayload.name.trim();

    const { data, error } = await supabase.from('events').update(updatePayload).eq('id', id).select().single();
    if (error) throw new AuthError(error.message, 500);
    if (!data) throw new AuthError('Event not found.', 404);

    let passes;
    if (body.passes !== undefined) {
      passes = await replacePasses(supabase, id, body.passes);
    }

    sendJson(res, 200, { event: passes !== undefined ? { ...data, passes } : data });
    return;
  }

  // DELETE — Super Admin only, destructive
  requireSuperAdmin(admin);
  const { error, count } = await supabase.from('events').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AuthError(error.message, 500);
  if (!count) throw new AuthError('Event not found.', 404);

  sendJson(res, 200, { success: true });
});
