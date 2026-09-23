import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Card, CardContent, Button, Badge, Skeleton, Modal } from '../ui'
import {
  Search, MapPin, Calendar, Clock, ChevronRight, Zap, Trophy, Link as LinkIcon,
  UploadCloud, FileCheck2, X, Loader2, CheckCircle2, ArrowLeft, CalendarX,
} from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { useStudentStore } from '../../../store/useStudentStore'
import { studentFetch, studentUploadFile, StudentApiError } from '../../../lib/studentApi'
import { XP_RULES } from '../../../lib/xp'

function formatDateRange(start, end) {
  if (!start && !end) return 'Date TBA'
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt(start || end)
}

function getRegistrationStatus(event) {
  if (!event.registration_deadline) return { key: 'open', label: '✓ Open', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }
  const deadline = new Date(event.registration_deadline).getTime()
  const now = Date.now()
  if (deadline < now) return { key: 'closed', label: '✕ Closed', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
  if (deadline - now < 3 * 24 * 60 * 60 * 1000) {
    return { key: 'closing-soon', label: '⏰ Closing Soon', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' }
  }
  return { key: 'open', label: '✓ Open', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }
}

const CATEGORY_LABELS = {
  Hackathon: 'Hackathons', Workshop: 'Workshops', Seminar: 'Seminars', Webinar: 'Webinars',
  Summit: 'Summits', Conference: 'Conferences', 'Tech Carnival': 'Tech Carnivals', 'Tech Podcast': 'Tech Podcasts',
  Bootcamp: 'Bootcamps', Competition: 'Competitions', Networking: 'Networking', Other: 'Other',
}

const TIER_STYLES = {
  Free: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Silver: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
  Standard: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
  Gold: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
}

// Derives a Free/Silver/Gold tier purely from each pass's price relative to
// its siblings on the same event — no extra "tier" field needed in the DB.
function getPassTier(pass, allPasses) {
  if (Number(pass.price) === 0) return 'Free'
  const paid = [...allPasses].filter((p) => Number(p.price) > 0).sort((a, b) => a.price - b.price)
  if (paid.length <= 1) return 'Standard'
  if (pass.id === paid[0].id) return 'Silver'
  if (pass.id === paid[paid.length - 1].id) return 'Gold'
  return 'Standard'
}

function formatCountdown(ms) {
  if (ms <= 0) return null
  const days = Math.floor(ms / (24 * 60 * 60 * 1000))
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

function CountdownTimer({ deadline, className }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000)
    return () => clearInterval(id)
  }, [])

  if (!deadline) return null
  const remaining = formatCountdown(new Date(deadline).getTime() - now)
  if (!remaining) return null

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${className || 'text-[#c84c30]'}`}>
      <Clock className="w-3.5 h-3.5" /> {remaining}
    </span>
  )
}

function PaymentProofField({ value, onChange, onError }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = React.useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const { url } = await studentUploadFile(file, 'payment-proof')
      onChange(url)
    } catch (err) {
      onError?.(err instanceof StudentApiError ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
        Payment Proof <span className="text-red-500">*</span>
      </label>
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-cozy-light dark:bg-cozy-dark/50">
          <FileCheck2 className="w-5 h-5 text-green-600 shrink-0" />
          <a href={value} target="_blank" rel="noreferrer" className="text-sm text-[#c84c30] truncate flex-1 hover:underline">
            View uploaded proof
          </a>
          <button type="button" onClick={() => onChange('')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0" aria-label="Remove file">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#c84c30] hover:bg-[#c84c30]/5 transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-6 h-6 text-[#c84c30] animate-spin" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {uploading ? 'Uploading…' : 'Click to upload screenshot / receipt'}
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export default function ExploreEventsTab() {
  const { addNotification } = useDashboard()
  const profile = useStudentStore((s) => s.profile)

  const [events, setEvents] = useState([])
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [detailEvent, setDetailEvent] = useState(null)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [regForm, setRegForm] = useState({ student_name: '', student_phone: '', college: '', team_name: '', pass_id: '', payment_proof_url: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        fetch('/api/events').then((r) => r.json()),
        studentFetch('/api/student/events').catch(() => ({ registrations: [] })),
      ])
      setEvents(eventsRes.events || [])
      setRegisteredEventIds(new Set((registrationsRes.registrations || []).map((r) => r.event?.id).filter(Boolean)))
    } catch {
      addNotification('Failed to load events.', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categories = useMemo(() => {
    const present = new Set(events.map((e) => e.category).filter(Boolean))
    return [{ id: 'all', label: 'All Events' }, ...Array.from(present).map((c) => ({ id: c, label: CATEGORY_LABELS[c] || c }))]
  }, [events])

  const filteredEvents = events.filter((event) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = !q || event.name.toLowerCase().includes(q) || (event.description || '').toLowerCase().includes(q)
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openDetail = (event) => {
    setDetailEvent(event)
    setShowRegisterForm(false)
    setRegForm({
      student_name: profile?.full_name || '',
      student_phone: profile?.phone || '',
      college: profile?.college || '',
      team_name: '',
      pass_id: '',
      payment_proof_url: '',
    })
  }

  const closeModal = () => {
    setDetailEvent(null)
    setShowRegisterForm(false)
  }

  const handleRegister = async () => {
    if (!detailEvent) return
    if (!regForm.student_name.trim()) {
      addNotification('Full name is required.', 'error')
      return
    }
    const hasPasses = detailEvent.passes?.length > 0
    if (hasPasses && !regForm.pass_id) {
      addNotification('Please select a pass to continue.', 'error')
      return
    }
    const selectedPass = hasPasses ? detailEvent.passes.find((p) => p.id === regForm.pass_id) : null
    const paymentRequired = hasPasses ? Number(selectedPass?.price || 0) > 0 : detailEvent.payment_required
    if (paymentRequired && !regForm.payment_proof_url) {
      addNotification('Please upload payment proof before submitting.', 'error')
      return
    }
    setSubmitting(true)
    try {
      await studentFetch('/api/student/register', {
        method: 'POST',
        body: { event_id: detailEvent.id, ...regForm },
      })
      addNotification(`Registered for "${detailEvent.name}"!`, 'success')
      setRegisteredEventIds((prev) => new Set(prev).add(detailEvent.id))
      closeModal()
      setTimeout(() => addNotification(`⚡ +${XP_RULES.registration} XP earned!`, 'success'), 400)
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Registration failed.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light mb-2">
          🎯 Explore Events
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and register for exciting opportunities
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-[#404854] bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#c84c30] text-white'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton height="280px" count={3} />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getRegistrationStatus(event)
            const isRegistered = registeredEventIds.has(event.id)
            return (
              <Card
                key={event.id}
                padding={false}
                className="hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                onClick={() => openDetail(event)}
              >
                <div
                  className="h-32 bg-gradient-to-br from-[#c84c30]/15 to-[#8ab4f8]/15 border-b border-gray-200 dark:border-[#404854] bg-cover bg-center relative"
                  style={event.banner_url ? { backgroundImage: `url(${event.banner_url})` } : undefined}
                >
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    {event.category && (
                      <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-1.5 text-xs bg-white/90 dark:bg-black/70 text-cozy-dark dark:text-cozy-light">
                        {event.category}
                      </span>
                    )}
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold text-cozy-dark dark:text-cozy-light text-lg line-clamp-2">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {event.description || 'No description provided yet.'}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(event.start_date, event.end_date)}</span>
                    </div>
                    {event.venue_type && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{event.venue_type}{event.venue_address ? ` · ${event.venue_address}` : ''}</span>
                      </div>
                    )}
                    <CountdownTimer deadline={event.registration_deadline} />
                  </div>

                  {event.prize_pool ? (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" /> ₹{Number(event.prize_pool).toLocaleString()} prize pool
                      </p>
                    </div>
                  ) : null}

                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-[#404854]">
                    {isRegistered ? (
                      <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1" disabled>
                        <CheckCircle2 className="w-4 h-4" /> Registered
                      </Button>
                    ) : (
                      <Button
                        variant={status.key === 'closed' ? 'outline' : 'primary'}
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                        disabled={status.key === 'closed'}
                      >
                        <Zap className="w-4 h-4" />
                        {status.key === 'closed' ? 'Closed' : 'Register'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center flex flex-col items-center gap-2">
            <CalendarX className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              {events.length === 0 ? 'No events available yet' : 'No events found'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {events.length === 0 ? 'Check back soon for upcoming events.' : 'Try adjusting your search or filters'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Tip */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100">Pro Tip</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Register for events early to secure your spot. Popular events fill up quickly!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detail / Register Modal */}
      <Modal
        isOpen={!!detailEvent}
        onClose={closeModal}
        title={showRegisterForm ? `Register — ${detailEvent?.name}` : detailEvent?.name}
        size="2xl"
      >
        {detailEvent && !showRegisterForm && (
          <div className="space-y-5">
            {detailEvent.banner_url && (
              <img src={detailEvent.banner_url} alt="" className="w-full h-48 object-cover rounded-lg" />
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {detailEvent.category && <Badge>{detailEvent.category}</Badge>}
              <Badge className={getRegistrationStatus(detailEvent).color}>{getRegistrationStatus(detailEvent).label}</Badge>
              {registeredEventIds.has(detailEvent.id) && (
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Registered</Badge>
              )}
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {detailEvent.description || 'No description provided yet.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{formatDateRange(detailEvent.start_date, detailEvent.end_date)}</span>
              </div>
              {detailEvent.registration_deadline && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Registration closes {new Date(detailEvent.registration_deadline).toLocaleString()}</span>
                  <CountdownTimer deadline={detailEvent.registration_deadline} />
                </div>
              )}
              {detailEvent.venue_address && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{detailEvent.venue_address}</span>
                </div>
              )}
              {detailEvent.venue_link && (
                <a href={detailEvent.venue_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#c84c30] hover:underline">
                  <LinkIcon className="w-4 h-4 shrink-0" />
                  <span>Meeting / stream link</span>
                </a>
              )}
            </div>

            {(detailEvent.prize_pool || detailEvent.prize_details) && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200 flex items-center gap-1.5 mb-1">
                  <Trophy className="w-4 h-4" /> {detailEvent.prize_pool ? `₹${Number(detailEvent.prize_pool).toLocaleString()} Prize Pool` : 'Prizes'}
                </p>
                {detailEvent.prize_details && <p className="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-line">{detailEvent.prize_details}</p>}
              </div>
            )}

            {(detailEvent.rules_text || detailEvent.rules_doc_url) && (
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Rules & Guidelines</p>
                {detailEvent.rules_text && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line mb-2">{detailEvent.rules_text}</p>}
                {detailEvent.rules_doc_url && (
                  <a href={detailEvent.rules_doc_url} target="_blank" rel="noreferrer" className="text-sm text-[#c84c30] hover:underline">
                    View full rulebook →
                  </a>
                )}
              </div>
            )}

            {detailEvent.passes?.length > 0 ? (
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Passes</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detailEvent.passes.map((pass) => {
                    const tier = getPassTier(pass, detailEvent.passes)
                    return (
                      <div key={pass.id} className="p-3 rounded-lg border border-gray-200 dark:border-[#404854]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-cozy-dark dark:text-cozy-light flex items-center gap-2">
                            {pass.name}
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${TIER_STYLES[tier]}`}>{tier}</span>
                          </span>
                          <span className="text-sm font-bold text-[#c84c30]">{Number(pass.price) > 0 ? `₹${Number(pass.price).toLocaleString()}` : 'Free'}</span>
                        </div>
                        {pass.description && <p className="text-xs text-gray-500 dark:text-gray-400">{pass.description}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-gray-200 dark:border-[#404854] flex items-center justify-between">
                <span className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Entry Fee</span>
                <span className="text-sm font-bold text-cozy-dark dark:text-cozy-light">
                  {detailEvent.payment_required ? `₹${Number(detailEvent.payment_amount || 0).toLocaleString()}` : 'Free'}
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {registeredEventIds.has(detailEvent.id) ? (
                <Button variant="outline" className="flex-1" disabled>
                  <CheckCircle2 className="w-4 h-4 mr-1.5 inline" /> Already Registered
                </Button>
              ) : getRegistrationStatus(detailEvent).key === 'closed' ? (
                <Button variant="outline" className="flex-1" disabled>Registration Closed</Button>
              ) : (
                <Button variant="primary" className="flex-1" onClick={() => setShowRegisterForm(true)}>
                  Register Now
                </Button>
              )}
            </div>
          </div>
        )}

        {detailEvent && showRegisterForm && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowRegisterForm(false)}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#c84c30]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to event details
            </button>

            <div>
              <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={regForm.student_name}
                onChange={(e) => setRegForm((p) => ({ ...p, student_name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">Phone</label>
                <input
                  type="tel"
                  value={regForm.student_phone}
                  onChange={(e) => setRegForm((p) => ({ ...p, student_phone: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">College</label>
                <input
                  type="text"
                  value={regForm.college}
                  onChange={(e) => setRegForm((p) => ({ ...p, college: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
                Team Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={regForm.team_name}
                onChange={(e) => setRegForm((p) => ({ ...p, team_name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
              />
            </div>

            {detailEvent.passes?.length > 0 ? (
              <div>
                <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
                  Select a Pass <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {detailEvent.passes.map((pass) => {
                    const tier = getPassTier(pass, detailEvent.passes)
                    return (
                      <button
                        key={pass.id}
                        type="button"
                        onClick={() => setRegForm((p) => ({ ...p, pass_id: pass.id }))}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          regForm.pass_id === pass.id
                            ? 'border-[#c84c30] bg-[#c84c30]/5'
                            : 'border-gray-200 dark:border-[#404854] hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-cozy-dark dark:text-cozy-light flex items-center gap-2">
                            {pass.name}
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${TIER_STYLES[tier]}`}>{tier}</span>
                          </span>
                          <span className="text-sm font-bold text-[#c84c30]">{Number(pass.price) > 0 ? `₹${Number(pass.price).toLocaleString()}` : 'Free'}</span>
                        </div>
                        {pass.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pass.description}</p>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              detailEvent.payment_required && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-1">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                    Entry Fee: ₹{Number(detailEvent.payment_amount || 0).toLocaleString()}
                  </p>
                  {detailEvent.payment_instructions && (
                    <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">{detailEvent.payment_instructions}</p>
                  )}
                </div>
              )
            )}

            {(() => {
              const hasPasses = detailEvent.passes?.length > 0
              const selectedPass = hasPasses ? detailEvent.passes.find((p) => p.id === regForm.pass_id) : null
              const needsProof = hasPasses ? Number(selectedPass?.price || 0) > 0 : detailEvent.payment_required
              return needsProof && (
                <PaymentProofField
                  value={regForm.payment_proof_url}
                  onChange={(url) => setRegForm((p) => ({ ...p, payment_proof_url: url }))}
                  onError={(msg) => addNotification(msg, 'error')}
                />
              )
            })()}

            <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={handleRegister} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Submitting…' : 'Confirm Registration'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
