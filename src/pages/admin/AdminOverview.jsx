import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarRange, Rocket, FileEdit, Users2, Plus, ArrowRight } from 'lucide-react'
import { useAdmin, useAdminBreadcrumb } from '../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../lib/adminApi'
import { useAdminStore } from '../../store/useAdminStore'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { Card, Skeleton } from '../../components/dashboard/ui'

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#c84c30]/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#c84c30]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
          {loading ? (
            <Skeleton height="24px" width="48px" className="mt-1" />
          ) : (
            <p className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">{value}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function AdminOverview() {
  const navigate = useNavigate()
  const { toast } = useAdmin()
  const admin = useAdminStore((s) => s.admin)
  useAdminBreadcrumb([{ label: 'Overview' }])

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetch('/api/admin/events')
      .then((data) => setEvents(data.events || []))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : 'Failed to load events.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const published = events.filter((e) => e.status === 'published').length
  const drafts = events.filter((e) => e.status === 'draft').length
  const totalRegistered = events.reduce((sum, e) => sum + (e.total_registered || 0), 0)
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <div>
      <AdminPageHeader
        title={`Welcome back${admin?.email ? ', ' + admin.email.split('@')[0] : ''}`}
        description="Here's what's happening across InnoTech-Hub right now."
        actions={
          <button
            onClick={() => navigate('/admin/events/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarRange} label="Total Events" value={events.length} loading={loading} />
        <StatCard icon={Rocket} label="Published" value={published} loading={loading} />
        <StatCard icon={FileEdit} label="Drafts" value={drafts} loading={loading} />
        <StatCard icon={Users2} label="Total Registrations" value={totalRegistered} loading={loading} />
      </div>

      <Card padding={false}>
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-[#404854]">
          <h2 className="font-bold text-cozy-dark dark:text-cozy-light">Recently Created Events</h2>
          <button
            onClick={() => navigate('/admin/events')}
            className="text-sm font-semibold text-[#c84c30] hover:text-[#a83c24] flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#252d36]">
          {loading && (
            <div className="p-4 md:p-6 space-y-3">
              <Skeleton height="20px" count={3} />
            </div>
          )}

          {!loading && recentEvents.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No events yet. Create your first one to get started.
            </div>
          )}

          {!loading &&
            recentEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/admin/events/${event.id}`)}
                className="w-full flex items-center justify-between gap-4 px-4 md:px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-[#171c23] transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-cozy-dark dark:text-cozy-light truncate">{event.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{event.status} · {event.total_registered || 0} registered</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
        </div>
      </Card>
    </div>
  )
}
