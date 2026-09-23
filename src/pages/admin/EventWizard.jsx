import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck, Plus, Trash2 } from 'lucide-react'
import { useAdmin, useAdminBreadcrumb } from '../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../lib/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import StepIndicator from '../../components/admin/wizard/StepIndicator'
import UploadField from '../../components/admin/wizard/UploadField'
import GalleryUploadField from '../../components/admin/wizard/GalleryUploadField'
import { Input, Select, Textarea } from '../../components/dashboard/ui'

const STEPS = ['Basic Details', 'Dates', 'Venue & Links', 'Media', 'Rules & Docs', 'Pricing & Passes', 'Review']

const CATEGORY_OPTIONS = [
  { value: 'Hackathon', label: 'Hackathon' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Webinar', label: 'Webinar' },
  { value: 'Summit', label: 'Summit' },
  { value: 'Conference', label: 'Conference' },
  { value: 'Tech Carnival', label: 'Tech Carnival' },
  { value: 'Tech Podcast', label: 'Tech Podcast' },
  { value: 'Bootcamp', label: 'Bootcamp' },
  { value: 'Competition', label: 'Competition' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Other', label: 'Other' },
]

const PASS_HINT_CATEGORIES = new Set(['Tech Podcast', 'Tech Carnival'])
const TIERED_PASS_HINT_CATEGORIES = new Set(['Summit', 'Conference'])

let passIdCounter = 0
const newPassRow = () => ({ _key: `new-${++passIdCounter}`, name: '', description: '', price: '', capacity: '' })

const VENUE_TYPE_OPTIONS = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline (In-person)' },
  { value: 'hybrid', label: 'Hybrid' },
]

const emptyForm = {
  name: '', category: '', description: '',
  start_date: '', end_date: '', registration_deadline: '',
  venue_type: '', venue_address: '', venue_link: '',
  banner_url: '', gallery_urls: [],
  rules_text: '', rules_doc_url: '',
  prize_pool: '', prize_details: '', payment_required: false, payment_amount: '', payment_instructions: '',
  passes: [],
  status: 'draft',
}

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toIso(localValue) {
  if (!localValue) return null
  const d = new Date(localValue)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export default function EventWizard() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const { toast } = useAdmin()

  const [form, setForm] = useState(emptyForm)
  const [pricingMode, setPricingMode] = useState('free') // 'free' | 'single' | 'passes'
  const [loadingEvent, setLoadingEvent] = useState(isEdit)
  const [currentStep, setCurrentStep] = useState(0)
  const [furthestStep, setFurthestStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useAdminBreadcrumb(
    [{ label: 'Events', path: '/admin/events' }, { label: isEdit ? (form.name || 'Edit Event') : 'New Event' }],
    [isEdit, form.name]
  )

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    adminFetch(`/api/admin/events/${id}`)
      .then((data) => {
        if (cancelled) return
        const e = data.event
        setForm({
          name: e.name || '',
          category: e.category || '',
          description: e.description || '',
          start_date: toDatetimeLocal(e.start_date),
          end_date: toDatetimeLocal(e.end_date),
          registration_deadline: toDatetimeLocal(e.registration_deadline),
          venue_type: e.venue_type || '',
          venue_address: e.venue_address || '',
          venue_link: e.venue_link || '',
          banner_url: e.banner_url || '',
          gallery_urls: e.gallery_urls || [],
          rules_text: e.rules_text || '',
          rules_doc_url: e.rules_doc_url || '',
          prize_pool: e.prize_pool ?? '',
          prize_details: e.prize_details || '',
          payment_required: !!e.payment_required,
          payment_amount: e.payment_amount ?? '',
          payment_instructions: e.payment_instructions || '',
          passes: (e.passes || []).map((p) => ({
            _key: p.id, id: p.id, name: p.name, description: p.description || '',
            price: p.price ?? '', capacity: p.capacity ?? '',
          })),
          status: e.status || 'draft',
        })
        setPricingMode((e.passes || []).length > 0 ? 'passes' : e.payment_required ? 'single' : 'free')
        setFurthestStep(STEPS.length - 1)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : 'Failed to load event.')
        navigate('/admin/events')
      })
      .finally(() => !cancelled && setLoadingEvent(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const validateStep = (stepIndex, data = form) => {
    const e = {}
    if (stepIndex === 0) {
      if (!data.name.trim()) e.name = 'Event name is required.'
    }
    if (stepIndex === 1) {
      if (data.start_date && data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
        e.end_date = 'End date cannot be before the start date.'
      }
    }
    if (stepIndex === 2) {
      if (!data.venue_type) e.venue_type = 'Select a venue type.'
      if ((data.venue_type === 'offline' || data.venue_type === 'hybrid') && !data.venue_address.trim()) {
        e.venue_address = 'Venue address is required for offline/hybrid events.'
      }
      if ((data.venue_type === 'online' || data.venue_type === 'hybrid') && !data.venue_link.trim()) {
        e.venue_link = 'Meeting/stream link is required for online/hybrid events.'
      }
    }
    if (stepIndex === 5) {
      if (pricingMode === 'single' && (!data.payment_amount || Number(data.payment_amount) <= 0)) {
        e.payment_amount = 'Enter a payment amount greater than 0.'
      }
      if (pricingMode === 'passes') {
        if (data.passes.length === 0) {
          e.passes = 'Add at least one pass.'
        } else if (data.passes.some((p) => !p.name.trim() || p.price === '' || Number(p.price) < 0)) {
          e.passes = 'Every pass needs a name and a price of 0 or more.'
        }
      }
    }
    return e
  }

  const validateAll = () => {
    for (let i = 0; i < STEPS.length - 1; i += 1) {
      const stepErrors = validateStep(i)
      if (Object.keys(stepErrors).length > 0) return { step: i, errors: stepErrors }
    }
    return null
  }

  const goNext = () => {
    const stepErrors = validateStep(currentStep)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) return
    const next = Math.min(currentStep + 1, STEPS.length - 1)
    setCurrentStep(next)
    setFurthestStep((f) => Math.max(f, next))
  }

  const goBack = () => setCurrentStep((s) => Math.max(0, s - 1))

  const goToStep = (i) => {
    if (i <= furthestStep) {
      setErrors({})
      setCurrentStep(i)
    }
  }

  const buildPayload = () => ({
    name: form.name.trim(),
    category: form.category || null,
    description: form.description || null,
    start_date: toIso(form.start_date),
    end_date: toIso(form.end_date),
    registration_deadline: toIso(form.registration_deadline),
    venue_type: form.venue_type || null,
    venue_address: form.venue_address || null,
    venue_link: form.venue_link || null,
    banner_url: form.banner_url || null,
    gallery_urls: form.gallery_urls,
    rules_text: form.rules_text || null,
    rules_doc_url: form.rules_doc_url || null,
    prize_pool: form.prize_pool === '' ? null : Number(form.prize_pool),
    prize_details: form.prize_details || null,
    payment_required: pricingMode === 'single',
    payment_amount: pricingMode === 'single' && form.payment_amount !== '' ? Number(form.payment_amount) : null,
    payment_instructions: pricingMode === 'single' ? (form.payment_instructions || null) : null,
    passes: pricingMode === 'passes'
      ? form.passes.map((p) => ({
          name: p.name.trim(),
          description: p.description || null,
          price: Number(p.price) || 0,
          capacity: p.capacity === '' ? null : Number(p.capacity),
        }))
      : [],
  })

  const handleSubmit = async (publishNow = false) => {
    const invalid = validateAll()
    if (invalid) {
      setCurrentStep(invalid.step)
      setFurthestStep((f) => Math.max(f, invalid.step))
      setErrors(invalid.errors)
      toast.error('Please fix the highlighted fields before saving.')
      return
    }

    setSubmitting(true)
    try {
      const payload = buildPayload()
      if (publishNow) payload.status = 'published'
      else if (!isEdit) payload.status = 'draft'

      if (isEdit) {
        await adminFetch(`/api/admin/events/${id}`, { method: 'PUT', body: payload })
        toast.success('Event updated successfully.')
      } else {
        await adminFetch('/api/admin/events', { method: 'POST', body: payload })
        toast.success(publishNow ? 'Event created and published.' : 'Event saved as draft.')
      }
      navigate('/admin/events')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save event.')
    } finally {
      setSubmitting(false)
    }
  }

  const showVenueAddress = form.venue_type === 'offline' || form.venue_type === 'hybrid'
  const showVenueLink = form.venue_type === 'online' || form.venue_type === 'hybrid'

  if (loadingEvent) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <ShieldCheck className="w-8 h-8 text-[#c84c30] animate-pulse" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading event…</p>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Edit Event' : 'Create Event'}
        description="Fill out each step — you can jump back to a previous step any time before saving."
      />

      <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg p-4 md:p-6">
        <StepIndicator steps={STEPS} currentStep={currentStep} furthestStep={furthestStep} onStepClick={goToStep} />

        <div className="min-h-[320px]">
          {currentStep === 0 && (
            <div className="space-y-5">
              <Input
                label="Event Name" required
                value={form.name} onChange={(e) => update({ name: e.target.value })}
                error={errors.name} placeholder="e.g. InnoTech Hackathon 2026"
              />
              <Select
                label="Category"
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={(e) => update({ category: e.target.value })}
              />
              <Textarea
                label="Description" rows={5}
                value={form.description} onChange={(e) => update({ description: e.target.value })}
                placeholder="What is this event about? What will attendees do or learn?"
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Start Date & Time" type="datetime-local"
                  value={form.start_date} onChange={(e) => update({ start_date: e.target.value })}
                />
                <Input
                  label="End Date & Time" type="datetime-local"
                  value={form.end_date} onChange={(e) => update({ end_date: e.target.value })}
                  error={errors.end_date}
                />
              </div>
              <Input
                label="Registration Deadline" type="datetime-local"
                value={form.registration_deadline} onChange={(e) => update({ registration_deadline: e.target.value })}
                helperText="Optional — leave blank to accept registrations until the event starts."
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <Select
                label="Venue Type" required
                options={VENUE_TYPE_OPTIONS}
                value={form.venue_type}
                onChange={(e) => update({ venue_type: e.target.value })}
                error={errors.venue_type}
              />
              {showVenueAddress && (
                <Textarea
                  label="Venue Address" rows={3} required
                  value={form.venue_address} onChange={(e) => update({ venue_address: e.target.value })}
                  error={errors.venue_address}
                  placeholder="Full address / building / room details"
                />
              )}
              {showVenueLink && (
                <Input
                  label="Meeting / Stream Link" required
                  value={form.venue_link} onChange={(e) => update({ venue_link: e.target.value })}
                  error={errors.venue_link}
                  placeholder="https://meet.google.com/…"
                />
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <UploadField
                label="Event Banner"
                helperText="Recommended: 1600×900px. Shown on the event card and detail page."
                folder="banner"
                accept="image/*"
                value={form.banner_url}
                onChange={(url) => update({ banner_url: url })}
                onError={(msg) => toast.error(msg)}
              />
              <GalleryUploadField
                label="Gallery Images"
                helperText="Optional — past edition photos, sponsor logos, venue shots, etc."
                folder="gallery"
                accept="image/*"
                values={form.gallery_urls}
                onChange={(urls) => update({ gallery_urls: urls })}
                onError={(msg) => toast.error(msg)}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Textarea
                label="Rules & Guidelines" rows={6}
                value={form.rules_text} onChange={(e) => update({ rules_text: e.target.value })}
                placeholder="Eligibility, team size, submission format, code of conduct…"
              />
              <UploadField
                label="Rules Document"
                helperText="Optional — PDF or Word doc with the full rulebook."
                folder="rules"
                accept=".pdf,.doc,.docx,image/*"
                value={form.rules_doc_url}
                onChange={(url) => update({ rules_doc_url: url })}
                onError={(msg) => toast.error(msg)}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Total Prize Pool (₹)" type="number" min="0"
                  value={form.prize_pool} onChange={(e) => update({ prize_pool: e.target.value })}
                  placeholder="e.g. 50000"
                />
              </div>
              <Textarea
                label="Prize Breakdown" rows={4}
                value={form.prize_details} onChange={(e) => update({ prize_details: e.target.value })}
                placeholder="1st place: ₹25,000, 2nd place: ₹15,000, …"
              />

              <div className="border-t border-gray-200 dark:border-[#404854] pt-6">
                <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-3">
                  Entry Fee
                </label>

                {(PASS_HINT_CATEGORIES.has(form.category) || TIERED_PASS_HINT_CATEGORIES.has(form.category)) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                    💡 {PASS_HINT_CATEGORIES.has(form.category)
                      ? `${form.category} events on InnoTech-Hub typically use a single Entry Pass.`
                      : `${form.category} events often use tiered passes (e.g. Early Bird / Standard / VIP).`} Use "Multiple Passes" below if that fits — this is only a suggestion.
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { value: 'free', label: 'Free' },
                    { value: 'single', label: 'Single Price' },
                    { value: 'passes', label: 'Multiple Passes' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPricingMode(opt.value)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                        pricingMode === opt.value
                          ? 'bg-[#c84c30] border-[#c84c30] text-white'
                          : 'border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {pricingMode === 'single' && (
                  <div className="space-y-5">
                    <Input
                      label="Payment Amount (₹)" type="number" min="0" required
                      value={form.payment_amount} onChange={(e) => update({ payment_amount: e.target.value })}
                      error={errors.payment_amount}
                    />
                    <Textarea
                      label="Payment Instructions" rows={3}
                      value={form.payment_instructions} onChange={(e) => update({ payment_instructions: e.target.value })}
                      placeholder="UPI ID, bank details, or payment link students should use."
                    />
                  </div>
                )}

                {pricingMode === 'passes' && (
                  <div className="space-y-4">
                    {errors.passes && <p className="text-xs text-red-500 font-medium">{errors.passes}</p>}
                    {form.passes.map((pass, i) => (
                      <div key={pass._key} className="p-4 rounded-lg border border-gray-200 dark:border-[#404854] space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => update({ passes: form.passes.filter((_, idx) => idx !== i) })}
                          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          aria-label="Remove pass"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                          <Input
                            label="Pass Name" required
                            value={pass.name}
                            onChange={(e) => update({ passes: form.passes.map((p, idx) => idx === i ? { ...p, name: e.target.value } : p) })}
                            placeholder="e.g. Early Bird"
                          />
                          <Input
                            label="Price (₹)" type="number" min="0" required
                            value={pass.price}
                            onChange={(e) => update({ passes: form.passes.map((p, idx) => idx === i ? { ...p, price: e.target.value } : p) })}
                            placeholder="0 for free"
                          />
                        </div>
                        <Input
                          label="Description (Optional)"
                          value={pass.description}
                          onChange={(e) => update({ passes: form.passes.map((p, idx) => idx === i ? { ...p, description: e.target.value } : p) })}
                          placeholder="What's included with this pass?"
                        />
                        <Input
                          label="Capacity (Optional)" type="number" min="0"
                          value={pass.capacity}
                          onChange={(e) => update({ passes: form.passes.map((p, idx) => idx === i ? { ...p, capacity: e.target.value } : p) })}
                          placeholder="Leave blank for unlimited"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => update({ passes: [...form.passes, newPassRow()] })}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light hover:border-[#c84c30] hover:text-[#c84c30]"
                    >
                      <Plus className="w-4 h-4" /> Add Pass
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <ReviewStep form={form} pricingMode={pricingMode} />
          )}
        </div>

        {/* Wizard nav */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-[#404854]">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light disabled:opacity-60"
              >
                {isEdit ? 'Save Changes' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? 'Save & Publish' : 'Create & Publish'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewStep({ form, pricingMode }) {
  const pricingSummary = pricingMode === 'passes'
    ? form.passes.map((p) => `${p.name} (₹${p.price || 0})`).join(', ') || '—'
    : pricingMode === 'single'
      ? `Single price — ₹${form.payment_amount || 0}`
      : 'Free'

  const rows = useMemo(() => ([
    ['Name', form.name],
    ['Category', form.category || '—'],
    ['Dates', [form.start_date, form.end_date].filter(Boolean).join(' → ') || '—'],
    ['Registration Deadline', form.registration_deadline || '—'],
    ['Venue Type', form.venue_type || '—'],
    ['Venue Address', form.venue_address || '—'],
    ['Venue Link', form.venue_link || '—'],
    ['Banner', form.banner_url ? 'Uploaded' : 'Not uploaded'],
    ['Gallery Images', `${form.gallery_urls.length} uploaded`],
    ['Rules Document', form.rules_doc_url ? 'Uploaded' : 'Not uploaded'],
    ['Prize Pool', form.prize_pool ? `₹${form.prize_pool}` : '—'],
    ['Entry Fee', pricingSummary],
  ]), [form, pricingSummary])

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Review everything below, then save as a draft or publish immediately.
      </p>
      <dl className="divide-y divide-gray-100 dark:divide-[#252d36] border border-gray-200 dark:border-[#404854] rounded-lg overflow-hidden">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 px-4 py-3 bg-white dark:bg-[#1a1f26]">
            <dt className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{label}</dt>
            <dd className="text-sm font-semibold text-cozy-dark dark:text-cozy-light text-right break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
