import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, Button, Badge, Skeleton } from '../ui'
import { Calendar, MapPin, Link as LinkIcon, CalendarX } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { studentFetch, StudentApiError } from '../../../lib/studentApi'

const PAYMENT_BADGE = {
  not_required: { variant: 'secondary', label: 'No Payment Required' },
  pending: { variant: 'warning', label: 'Payment Pending' },
  submitted: { variant: 'info', label: 'Payment Submitted' },
  approved: { variant: 'success', label: 'Payment Approved' },
  rejected: { variant: 'error', label: 'Payment Rejected' },
}

function formatDateRange(start, end) {
  if (!start && !end) return 'Date TBA'
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt(start || end)
}

function RegistrationCard({ registration }) {
  const event = registration.event
  const payment = PAYMENT_BADGE[registration.payment_status] || PAYMENT_BADGE.not_required

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-cozy-dark dark:text-cozy-light text-lg">
            {event?.name || 'Event unavailable'}
          </h3>
          <Badge variant={payment.variant} className="flex-shrink-0">{payment.label}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDateRange(event?.start_date, event?.end_date)}</span>
          </div>
          {event?.venue_address && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{event.venue_address}</span>
            </div>
          )}
          {event?.venue_link && (
            <a
              href={event.venue_link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#c84c30] hover:underline"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Join Link</span>
            </a>
          )}
        </div>

        {registration.team_name && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Team: {registration.team_name}</p>
        )}

        <div className="flex gap-2 flex-wrap mt-3">
          <Button variant="outline" size="sm">View Details</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message }) {
  return (
    <Card>
      <CardContent className="py-10 text-center flex flex-col items-center gap-2">
        <CalendarX className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </CardContent>
    </Card>
  )
}

export default function MyEventsTab() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const { addNotification } = useDashboard()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await studentFetch('/api/student/events')
      setRegistrations(data.registrations || [])
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to load your events.', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const now = Date.now()
  const upcoming = registrations.filter((r) => {
    const end = r.event?.end_date || r.event?.start_date
    return !end || new Date(end).getTime() >= now
  })
  const past = registrations.filter((r) => {
    const end = r.event?.end_date || r.event?.start_date
    return end && new Date(end).getTime() < now
  })

  const TabButton = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`pb-3 px-4 font-semibold border-b-2 transition-all ${
        activeTab === tab
          ? 'text-[#c84c30] border-[#c84c30]'
          : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-cozy-dark dark:hover:text-cozy-light'
      }`}
    >
      {label} {count > 0 && <span className="text-xs">({count})</span>}
    </button>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light mb-2">📅 My Events</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your registrations and past event participation</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-[#404854] overflow-x-auto">
        <TabButton tab="upcoming" label="Upcoming" count={upcoming.length} />
        <TabButton tab="past" label="Past Events" count={past.length} />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton height="120px" count={2} />
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'upcoming' &&
            (upcoming.length > 0
              ? upcoming.map((r) => <RegistrationCard key={r.id} registration={r} />)
              : <EmptyState message="No upcoming events. Explore events to register!" />)}

          {activeTab === 'past' &&
            (past.length > 0
              ? past.map((r) => <RegistrationCard key={r.id} registration={r} />)
              : <EmptyState message="No past events yet. Your completed events will appear here." />)}
        </div>
      )}
    </div>
  )
}
