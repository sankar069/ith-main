import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../../_lib/auth.js';

function slugify(name) {
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

async function uniqueSlug(supabase, base) {
  let slug = base || 'event';
  let suffix = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const { data, error } = await supabase.from('events').select('id').eq('slug', candidate).maybeSingle();
    if (error) throw new AuthError('Failed to generate a unique event slug.', 500);
    if (!data) return candidate;
    suffix += 1;
  }
}

function validateEventPayload(body, { partial = false } = {}) {
  const errors = {};
  if (!partial || body.name !== undefined) {
    if (!body.name || !body.name.trim()) errors.name = 'Event name is required.';
  }
  if (!partial || body.status !== undefined) {
    if (body.status && !['draft', 'published', 'completed'].includes(body.status)) {
      errors.status = 'Status must be draft, published, or completed.';
    }
  }
  if (!partial || body.venue_type !== undefined) {
    if (body.venue_type && !['online', 'offline', 'hybrid'].includes(body.venue_type)) {
      errors.venue_type = 'Venue type must be online, offline, or hybrid.';
    }
  }
  if (body.start_date && body.end_date && new Date(body.end_date) < new Date(body.start_date)) {
    errors.end_date = 'End date cannot be before the start date.';
  }
  if (body.passes !== undefined && body.passes !== null) {
    if (!Array.isArray(body.passes)) {
      errors.passes = 'Passes must be a list.';
    } else if (body.passes.some((p) => !p.name || !p.name.trim() || p.price === '' || p.price === undefined || Number(p.price) < 0)) {
      errors.passes = 'Every pass needs a name and a price of 0 or more.';
    }
  }
  if (Object.keys(errors).length > 0) {
    const err = new AuthError('Validation failed.', 422);
    err.details = errors;
    throw err;
  }
}

/** Fully replaces an event's pass tiers with the given list (delete + reinsert, keeps ordering simple). */
async function replacePasses(supabase, eventId, passes) {
  const { error: deleteError } = await supabase.from('event_passes').delete().eq('event_id', eventId);
  if (deleteError) throw new AuthError(deleteError.message, 500);

  if (!Array.isArray(passes) || passes.length === 0) return [];

  const rows = passes.map((p, i) => ({
    event_id: eventId,
    name: p.name.trim(),
    description: p.description || null,
    price: Number(p.price) || 0,
    capacity: p.capacity === '' || p.capacity === undefined || p.capacity === null ? null : Number(p.capacity),
    sort_order: i,
  }));

  const { data, error } = await supabase.from('event_passes').insert(rows).select();
  if (error) throw new AuthError(error.message, 500);
  return data;
}

export default withAdminHandler(['GET', 'POST'], async (req, res) => {
  requireAdminAuth(req);
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('events')
      .select('*, event_registrations(count)')
      .order('created_at', { ascending: false });

    if (error) throw new AuthError(error.message, 500);

    const events = (data || []).map((row) => ({
      ...row,
      total_registered: row.event_registrations?.[0]?.count ?? 0,
      event_registrations: undefined,
    }));

    sendJson(res, 200, { events });
    return;
  }

  // POST — create
  const body = req.body || {};
  validateEventPayload(body);

  const baseSlug = slugify(body.slug || body.name);
  const slug = await uniqueSlug(supabase, baseSlug);

  const insertPayload = {
    name: body.name.trim(),
    slug,
    category: body.category || null,
    description: body.description || null,
    status: body.status || 'draft',
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    registration_deadline: body.registration_deadline || null,
    venue_type: body.venue_type || null,
    venue_address: body.venue_address || null,
    venue_link: body.venue_link || null,
    banner_url: body.banner_url || null,
    gallery_urls: Array.isArray(body.gallery_urls) ? body.gallery_urls : [],
    rules_text: body.rules_text || null,
    rules_doc_url: body.rules_doc_url || null,
    prize_pool: body.prize_pool ?? null,
    prize_details: body.prize_details || null,
    payment_required: !!body.payment_required,
    payment_amount: body.payment_amount ?? null,
    payment_instructions: body.payment_instructions || null,
  };

  const { data, error } = await supabase.from('events').insert(insertPayload).select().single();
  if (error) throw new AuthError(error.message, 500);

  const passes = await replacePasses(supabase, data.id, body.passes);

  sendJson(res, 201, { event: { ...data, total_registered: 0, passes } });
});

export { validateEventPayload, slugify, uniqueSlug, replacePasses };
