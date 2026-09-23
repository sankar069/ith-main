import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Pencil, Rocket, CheckCircle2, Trash2, Download, CalendarRange, Undo2,
} from 'lucide-react'
import { useAdmin, useAdminBreadcrumb } from '../../contexts/AdminContext'
import { useAdminStore } from '../../store/useAdminStore'
import { adminFetch, ApiError } from '../../lib/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import DataTable from '../../components/admin/DataTable'
import { Badge } from '../../components/dashboard/ui'
import { Modal } from '../../components/dashboard/ui'

const STATUS_BADGE = {
  draft: { variant: 'secondary', label: 'Draft' },
  published: { variant: 'success', label: 'Published' },
  completed: { variant: 'info', label: 'Completed' },
}

function formatDateRange(start, end) {
  if (!start && !end) return '—'
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt(start || end)
}

export default function EventMasterList() {
  const navigate = useNavigate()
  const { toast } = useAdmin()
  useAdminBreadcrumb([{ label: 'Events' }])

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch('/api/admin/events')
      setEvents(data.events || [])
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const patchEventLocally = (id, patch) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  const handleStatusChange = async (event, nextStatus) => {
    const prevStatus = event.status
    patchEventLocally(event.id, { status: nextStatus }) // optimistic
    try {
      await adminFetch(`/api/admin/events/${event.id}/status`, { method: 'PATCH', body: { status: nextStatus } })
      toast.success(`"${event.name}" is now ${nextStatus}.`)
    } catch (err) {
      patchEventLocally(event.id, { status: prevStatus }) // rollback
      toast.error(err instanceof ApiError ? err.message : 'Failed to update status.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/events/${deleteTarget.id}`, { method: 'DELETE' })
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.name}" was deleted.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete event.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDownloadCsv = async (event) => {
    try {
      const token = useAdminStore.getState().token
      const res = await fetch(`/api/admin/events/${event.id}/registrations?format=csv`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${event.slug || 'event'}-registrations.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Registrations CSV downloaded.')
    } catch {
      toast.error('Could not download registrations CSV.')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Event Name',
      sortable: true,
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/events/${row.id}`)}
          className="text-left hover:text-[#c84c30] transition-colors"
        >
          <p className="font-semibold">{row.name}</p>
          {row.category && <p className="text-xs text-gray-500 dark:text-gray-400">{row.category}</p>}
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const cfg = STATUS_BADGE[row.status] || STATUS_BADGE.draft
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>
      },
    },
    {
      key: 'start_date',
      label: 'Dates',
      sortable: true,
      render: (row) => <span className="text-sm">{formatDateRange(row.start_date, row.end_date)}</span>,
    },
    {
      key: 'total_registered',
      label: 'Total Registered',
      sortable: true,
      render: (row) => <span className="font-semibold">{row.total_registered ?? 0}</span>,
    },
  ]

  const rowActions = (row) => [
    { label: 'Edit', icon: Pencil, onClick: () => navigate(`/admin/events/${row.id}/edit`) },
    {
      label: 'Publish',
      icon: Rocket,
      hidden: row.status !== 'draft',
      onClick: () => handleStatusChange(row, 'published'),
    },
    {
      label: 'Mark as Complete',
      icon: CheckCircle2,
      hidden: row.status !== 'published',
      onClick: () => handleStatusChange(row, 'completed'),
    },
    {
      label: 'Revert to Draft',
      icon: Undo2,
      hidden: row.status === 'draft',
      onClick: () => handleStatusChange(row, 'draft'),
    },
    { label: 'Download Registrations (CSV)', icon: Download, onClick: () => handleDownloadCsv(row) },
    { label: 'Delete', icon: Trash2, variant: 'danger', onClick: () => setDeleteTarget(row) },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Event Management"
        description="Create, publish, and manage every InnoTech-Hub event from one place."
        actions={
          <button
            onClick={() => navigate('/admin/events/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        searchKeys={['name', 'category', 'status']}
        searchPlaceholder="Search events by name, category, or status…"
        rowActions={rowActions}
        emptyIcon={CalendarRange}
        emptyTitle="No events yet"
        emptyDescription="Create your first event to start accepting registrations."
        emptyAction={
          <button
            onClick={() => navigate('/admin/events/new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        }
      />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete this event?"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              {deleting ? 'Deleting…' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        <p className="text-sm text-cozy-dark dark:text-cozy-light">
          This will permanently delete <span className="font-bold">{deleteTarget?.name}</span> and all of its
          registrations, payments, and uploaded media. This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
