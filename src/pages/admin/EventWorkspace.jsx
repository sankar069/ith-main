import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Pencil, Rocket, CheckCircle2, Undo2, Trash2, Download, ArrowLeft,
  Users2, Wallet, CalendarRange, MapPin, ExternalLink, Check, X as XIcon,
  Award, Loader2,
} from 'lucide-react'
import { useAdmin, useAdminBreadcrumb } from '../../contexts/AdminContext'
import { useAdminStore } from '../../store/useAdminStore'
import { adminFetch, ApiError } from '../../lib/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import DataTable from '../../components/admin/DataTable'
import UploadField from '../../components/admin/wizard/UploadField'
import { Card, Badge, Skeleton, Modal, Input } from '../../components/dashboard/ui'

const STATUS_BADGE = {
  draft: { variant: 'secondary', label: 'Draft' },
  published: { variant: 'success', label: 'Published' },
  completed: { variant: 'info', label: 'Completed' },
}

const PAYMENT_BADGE = {
  not_required: { variant: 'secondary', label: 'No Payment' },
  pending: { variant: 'warning', label: 'Pending' },
  submitted: { variant: 'info', label: 'Submitted' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'error', label: 'Rejected' },
}

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#c84c30]/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#c84c30]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
          {loading ? <Skeleton height="24px" width="48px" className="mt-1" /> : <p className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">{value}</p>}
        </div>
      </div>
    </Card>
  )
}

function formatDateRange(start, end) {
  if (!start && !end) return '—'
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt(start || end)
}

export default function EventWorkspace() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useAdmin()

  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [proofPreview, setProofPreview] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [issueTarget, setIssueTarget] = useState(null) // registration row, or 'all'
  const [issueForm, setIssueForm] = useState({ title: '', issuer: 'InnoTech-Hub', certificate_url: '', skills: '' })
  const [issuing, setIssuing] = useState(false)

  useAdminBreadcrumb(
    [{ label: 'Events', path: '/admin/events' }, { label: event?.name || 'Event' }],
    [event?.name]
  )

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [eventData, regData, certData] = await Promise.all([
        adminFetch(`/api/admin/events/${id}`),
        adminFetch(`/api/admin/events/${id}/registrations`),
        adminFetch(`/api/admin/events/${id}/certificates`),
      ])
      setEvent(eventData.event)
      setRegistrations(regData.registrations || [])
      setCertificates(certData.certificates || [])
      setIssueForm((f) => ({ ...f, title: f.title || `Certificate of Participation — ${eventData.event.name}` }))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load event.')
      navigate('/admin/events')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (nextStatus) => {
    try {
      await adminFetch(`/api/admin/events/${id}/status`, { method: 'PATCH', body: { status: nextStatus } })
      setEvent((prev) => ({ ...prev, status: nextStatus }))
      toast.success(`Event is now ${nextStatus}.`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update status.')
    }
  }

  const handlePaymentStatus = async (registration, nextStatus) => {
    const prev = registration.payment_status
    setRegistrations((rows) => rows.map((r) => (r.id === registration.id ? { ...r, payment_status: nextStatus } : r)))
    try {
      await adminFetch(`/api/admin/events/${id}/registrations/${registration.id}`, {
        method: 'PATCH',
        body: { payment_status: nextStatus },
      })
      toast.success(`Marked ${registration.student_name}'s payment as ${nextStatus}.`)
    } catch (err) {
      setRegistrations((rows) => rows.map((r) => (r.id === registration.id ? { ...r, payment_status: prev } : r)))
      toast.error(err instanceof ApiError ? err.message : 'Failed to update payment status.')
    }
  }

  const handleDownloadCsv = async () => {
    try {
      const token = useAdminStore.getState().token
      const res = await fetch(`/api/admin/events/${id}/registrations?format=csv`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${event?.slug || 'event'}-registrations.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Could not download registrations CSV.')
    }
  }

  const openIssueModal = (target) => {
    setIssueTarget(target)
    setIssueForm((f) => ({ ...f, certificate_url: '' }))
  }

  const handleIssueCertificates = async () => {
    if (!issueForm.title.trim()) {
      toast.error('Certificate title is required.')
      return
    }
    const registrationIds = issueTarget === 'all'
      ? registrations.filter((r) => r.user_id).map((r) => r.id)
      : [issueTarget.id]

    if (registrationIds.length === 0) {
      toast.error('No eligible registrants to issue to.')
      return
    }

    setIssuing(true)
    try {
      const data = await adminFetch(`/api/admin/events/${id}/certificates`, {
        method: 'POST',
        body: {
          registration_ids: registrationIds,
          title: issueForm.title.trim(),
          issuer: issueForm.issuer,
          certificate_url: issueForm.certificate_url || null,
          skills: issueForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        },
      })
      setCertificates((prev) => [...prev, ...data.certificates])
      toast.success(
        data.issued > 0
          ? `Issued ${data.issued} certificate${data.issued !== 1 ? 's' : ''}${data.skipped ? ` (${data.skipped} already had one)` : ''}.`
          : 'Everyone selected already has a certificate for this event.'
      )
      setIssueTarget(null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to issue certificate.')
    } finally {
      setIssuing(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      toast.success(`"${event.name}" was deleted.`)
      navigate('/admin/events')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete event.')
      setDeleting(false)
    }
  }

  const totalRegistered = registrations.length
  const approved = registrations.filter((r) => r.payment_status === 'approved').length
  const pendingReview = registrations.filter((r) => ['pending', 'submitted'].includes(r.payment_status)).length

  const certifiedUserIds = new Set(certificates.map((c) => c.user_id))
  const eligibleForBulkIssue = registrations.filter((r) => r.user_id && !certifiedUserIds.has(r.user_id)).length

  const passes = event?.passes || []
  const passById = Object.fromEntries(passes.map((p) => [p.id, p]))
  const passBreakdown = passes.map((p) => ({
    ...p,
    count: registrations.filter((r) => r.pass_id === p.id).length,
  }))

  const columns = [
    {
      key: 'student_name',
      label: 'Registrant',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold">{row.student_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{row.student_email}</p>
        </div>
      ),
    },
    { key: 'student_phone', label: 'Phone', render: (row) => row.student_phone || '—' },
    { key: 'college', label: 'College', render: (row) => row.college || '—' },
    { key: 'team_name', label: 'Team', render: (row) => row.team_name || '—' },
    ...(passes.length > 0 ? [{
      key: 'pass_id',
      label: 'Pass',
      render: (row) => row.pass_id ? (passById[row.pass_id]?.name || 'Unknown pass') : '—',
    }] : []),
    {
      key: 'payment_status',
      label: 'Payment',
      sortable: true,
      render: (row) => {
        const cfg = PAYMENT_BADGE[row.payment_status] || PAYMENT_BADGE.not_required
        return (
          <div className="flex items-center gap-2">
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
            {row.payment_proof_url && (
              <button
                onClick={() => setProofPreview(row)}
                className="text-xs text-[#c84c30] hover:underline flex items-center gap-1"
              >
                Proof <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )
      },
    },
    {
      key: 'registered_at',
      label: 'Registered',
      sortable: true,
      render: (row) => <span className="text-sm">{new Date(row.registered_at).toLocaleDateString()}</span>,
    },
    {
      key: 'certificate',
      label: 'Certificate',
      render: (row) => (
        row.user_id && certifiedUserIds.has(row.user_id)
          ? <Badge variant="success" icon={Award}>Issued</Badge>
          : <span className="text-gray-400 text-sm">—</span>
      ),
    },
  ]

  const rowActions = (row) => [
    {
      label: 'Approve Payment',
      icon: Check,
      hidden: !['pending', 'submitted'].includes(row.payment_status),
      onClick: () => handlePaymentStatus(row, 'approved'),
    },
    {
      label: 'Reject Payment',
      icon: XIcon,
      hidden: !['pending', 'submitted'].includes(row.payment_status),
      variant: 'danger',
      onClick: () => handlePaymentStatus(row, 'rejected'),
    },
    {
      label: 'Issue Certificate',
      icon: Award,
      hidden: !row.user_id || certifiedUserIds.has(row.user_id),
      onClick: () => openIssueModal(row),
    },
  ]

  if (loading && !event) {
    return (
      <div className="space-y-4">
        <Skeleton height="32px" width="240px" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton height="90px" count={3} />
        </div>
      </div>
    )
  }

  if (!event) return null

  const statusCfg = STATUS_BADGE[event.status] || STATUS_BADGE.draft

  return (
    <div>
      <button
        onClick={() => navigate('/admin/events')}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#c84c30] mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </button>

      <AdminPageHeader
        title={event.name}
        description={
          <span className="flex items-center gap-2 flex-wrap mt-1">
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            {event.category && <Badge variant="secondary">{event.category}</Badge>}
          </span>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {event.status === 'draft' && (
              <button onClick={() => handleStatusChange('published')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold">
                <Rocket className="w-4 h-4" /> Publish
              </button>
            )}
            {event.status === 'published' && (
              <button onClick={() => handleStatusChange('completed')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900">
                <CheckCircle2 className="w-4 h-4" /> Mark Complete
              </button>
            )}
            {event.status !== 'draft' && (
              <button onClick={() => handleStatusChange('draft')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900">
                <Undo2 className="w-4 h-4" /> Revert to Draft
              </button>
            )}
            <button onClick={() => navigate(`/admin/events/${id}/edit`)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900">
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button onClick={() => setDeleteOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users2} label="Total Registered" value={totalRegistered} />
        <StatCard icon={Wallet} label="Payments Approved" value={approved} />
        <StatCard icon={CalendarRange} label="Awaiting Review" value={pendingReview} />
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <CalendarRange className="w-4 h-4 shrink-0" />
            <span>{formatDateRange(event.start_date, event.end_date)}</span>
          </div>
          {event.venue_type && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 capitalize">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{event.venue_type}{event.venue_address ? ` · ${event.venue_address}` : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Wallet className="w-4 h-4 shrink-0" />
            <span>
              {passes.length > 0
                ? `${passes.length} pass type${passes.length !== 1 ? 's' : ''}`
                : event.payment_required ? `₹${Number(event.payment_amount || 0).toLocaleString()} entry fee` : 'Free entry'}
            </span>
          </div>
          {event.registration_deadline && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span>Registration closes {new Date(event.registration_deadline).toLocaleString()}</span>
            </div>
          )}
        </div>
      </Card>

      {passes.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-sm font-bold text-cozy-dark dark:text-cozy-light mb-3">Pass Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {passBreakdown.map((pass) => (
              <div key={pass.id} className="p-3 rounded-lg border border-gray-200 dark:border-[#404854]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">{pass.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">₹{Number(pass.price).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {pass.count} registered{pass.capacity !== null ? ` / ${pass.capacity} capacity` : ''}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card padding={false}>
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-[#404854]">
          <h2 className="font-bold text-cozy-dark dark:text-cozy-light">Registrations</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openIssueModal('all')}
              disabled={eligibleForBulkIssue === 0}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c84c30] hover:text-[#a83c24] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Award className="w-4 h-4" /> Issue Certificates{eligibleForBulkIssue > 0 ? ` (${eligibleForBulkIssue})` : ''}
            </button>
            <button onClick={handleDownloadCsv} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c84c30] hover:text-[#a83c24]">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6 pt-0">
          <DataTable
            columns={columns}
            data={registrations}
            loading={loading}
            searchKeys={['student_name', 'student_email', 'college', 'team_name']}
            searchPlaceholder="Search registrants…"
            rowActions={rowActions}
            emptyIcon={Users2}
            emptyTitle="No registrations yet"
            emptyDescription="Registrations will appear here as students sign up."
          />
        </div>
      </Card>

      <Modal isOpen={!!proofPreview} onClose={() => setProofPreview(null)} title="Payment Proof" size="lg">
        {proofPreview && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">{proofPreview.student_name} · {proofPreview.student_email}</p>
            {/\.pdf($|\?)/i.test(proofPreview.payment_proof_url) ? (
              <a href={proofPreview.payment_proof_url} target="_blank" rel="noreferrer" className="text-[#c84c30] hover:underline text-sm">
                Open PDF proof →
              </a>
            ) : (
              <img src={proofPreview.payment_proof_url} alt="Payment proof" className="w-full rounded-lg border border-gray-200 dark:border-[#404854]" />
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!issueTarget}
        onClose={() => !issuing && setIssueTarget(null)}
        title={issueTarget === 'all' ? `Issue Certificates (${eligibleForBulkIssue})` : `Issue Certificate — ${issueTarget?.student_name}`}
        footer={
          <>
            <button onClick={() => setIssueTarget(null)} disabled={issuing} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleIssueCertificates}
              disabled={issuing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
            >
              {issuing && <Loader2 className="w-4 h-4 animate-spin" />}
              {issuing ? 'Issuing…' : 'Issue'}
            </button>
          </>
        }
      >
        {issueTarget && (
          <div className="space-y-4">
            <Input
              label="Certificate Title" required
              value={issueForm.title}
              onChange={(e) => setIssueForm((f) => ({ ...f, title: e.target.value }))}
            />
            <Input
              label="Issuer"
              value={issueForm.issuer}
              onChange={(e) => setIssueForm((f) => ({ ...f, issuer: e.target.value }))}
            />
            <UploadField
              label="Certificate File (Optional)"
              helperText="Attach a designed certificate PDF/image, or leave blank for a record-only certificate."
              folder="certificate"
              accept="application/pdf,image/*"
              value={issueForm.certificate_url}
              onChange={(url) => setIssueForm((f) => ({ ...f, certificate_url: url }))}
              onError={(msg) => toast.error(msg)}
            />
            <Input
              label="Skills (Optional)"
              helperText="Comma-separated — shows up on the student's public profile skill cloud, e.g. React, Public Speaking, Figma"
              value={issueForm.skills}
              onChange={(e) => setIssueForm((f) => ({ ...f, skills: e.target.value }))}
            />
            {issueTarget === 'all' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Students who already have a certificate for this event will be skipped automatically.
              </p>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        title="Delete this event?"
        footer={
          <>
            <button onClick={() => setDeleteOpen(false)} disabled={deleting} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60">
              {deleting ? 'Deleting…' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        <p className="text-sm text-cozy-dark dark:text-cozy-light">
          This will permanently delete <span className="font-bold">{event.name}</span> and all of its registrations, payments, and uploaded media. This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
