import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Trophy, ListChecks, RotateCw, ImageOff } from 'lucide-react'
import { formatEventDateRange, eventVenueLabel } from '../lib/eventDisplay'
import { useStudentStore } from '../store/useStudentStore'

function Skeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto animate-pulse">
      <div className="w-full aspect-[21/9] rounded-2xl bg-gray-200 dark:bg-white/10 mb-8" />
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-white/10 mb-4" />
      <div className="h-9 w-3/4 rounded bg-gray-200 dark:bg-white/10 mb-6" />
      <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/10 mb-2" />
      <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-white/10" />
    </div>
  )
}

export default function EventDetails() {
  const { slug } = useParams()
  const isAuthenticated = useStudentStore((s) => !!s.token)
  const [event, setEvent] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error | not-found

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(slug)}`)
      if (res.status === 404) {
        setStatus('not-found')
        return
      }
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setEvent(data.event)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  const registerTo = isAuthenticated ? '/dashboard?tab=explore-events' : '/login'

  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark min-h-screen">
      <div className="w-full max-w-3xl mx-auto px-4 pt-24 pb-20">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-[#c84c30] transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84c30] focus-visible:ring-offset-2 rounded"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Events
        </Link>

        {status === 'loading' && <Skeleton />}

        {status === 'error' && (
          <div className="flex flex-col items-center text-center py-16 px-6 rounded-2xl border border-[#f0e6e3] dark:border-gray-800 bg-[#FCFDFD] dark:bg-black/40">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Unable to load this event right now.
            </p>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#c84c30] hover:bg-[#b04027] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84c30] focus-visible:ring-offset-2"
            >
              <RotateCw className="w-4 h-4" aria-hidden="true" /> Try Again
            </button>
          </div>
        )}

        {status === 'not-found' && (
          <div className="flex flex-col items-center text-center py-16 px-6 rounded-2xl border border-[#f0e6e3] dark:border-gray-800 bg-[#FCFDFD] dark:bg-black/40">
            <h1 className="text-xl font-serif font-bold text-cozy-dark dark:text-cozy-light mb-1.5">
              Event Not Found
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              This event may have been removed or is no longer published.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#c84c30] hover:bg-[#b04027] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84c30] focus-visible:ring-offset-2"
            >
              Explore Events
            </Link>
          </div>
        )}

        {status === 'ready' && event && (
          <article>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-[#c84c30]/15 to-[#8ab4f8]/15 mb-8">
              {event.banner_url ? (
                <img src={event.banner_url} alt={event.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-10 h-10 text-[#c84c30]/40" aria-hidden="true" />
                </div>
              )}
            </div>

            {event.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#c84c30]/10 text-[#c84c30] mb-4">
                {event.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 leading-tight">
              {event.name}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c84c30]" aria-hidden="true" />
                {formatEventDateRange(event.start_date, event.end_date)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c84c30]" aria-hidden="true" />
                {eventVenueLabel(event)}
              </span>
            </div>

            {event.description && (
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-8">
                {event.description}
              </p>
            )}

            {(event.prize_pool || event.prize_details) && (
              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6">
                <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200 flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4" aria-hidden="true" />
                  {event.prize_pool ? `₹${Number(event.prize_pool).toLocaleString()} Prize Pool` : 'Prizes'}
                </p>
                {event.prize_details && (
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-line">{event.prize_details}</p>
                )}
              </div>
            )}

            {event.rules_text && (
              <div className="mb-8">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5" aria-hidden="true" /> Rules & Guidelines
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{event.rules_text}</p>
              </div>
            )}

            {event.passes?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Passes</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.passes.map((pass) => (
                    <div key={pass.id} className="p-3 rounded-xl border border-[#f0e6e3] dark:border-gray-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-cozy-dark dark:text-cozy-light">{pass.name}</span>
                        <span className="text-sm font-bold text-[#c84c30]">
                          {Number(pass.price) > 0 ? `₹${Number(pass.price).toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                      {pass.description && <p className="text-xs text-gray-500 dark:text-gray-400">{pass.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              to={registerTo}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#c84c30] hover:bg-[#b04027] text-white font-sans text-sm font-bold transition-all shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84c30] focus-visible:ring-offset-2"
            >
              Register Now
            </Link>
          </article>
        )}
      </div>
    </div>
  )
}
