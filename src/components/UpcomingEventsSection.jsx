import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarX, ArrowRight, RotateCw } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import EventCard from './EventCard'
import EventCardSkeleton from './EventCardSkeleton'
import { isUpcomingEvent } from '../lib/eventDisplay'

const MAX_EVENTS = 6

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      // /api/events already scopes to status = 'published' and sorts by
      // start_date ascending — only "upcoming" (future start_date) needs
      // filtering here, and we just take the first N off the pre-sorted list.
      const upcoming = (data.events || []).filter((e) => isUpcomingEvent(e)).slice(0, MAX_EVENTS)
      setEvents(upcoming)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <ScrollReveal className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-16 px-4">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> UPCOMING EVENTS
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 text-center leading-tight">
        Discover What's <span className="text-[#c84c30] italic font-serif">Next</span>
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-14 max-w-2xl leading-relaxed">
        Explore upcoming hackathons, workshops, seminars, competitions, and innovation-driven events happening across the InnoTech Hub ecosystem.
      </p>

      {/* Content */}
      {status === 'loading' && (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
              <EventCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="w-full max-w-md flex flex-col items-center text-center py-10 px-6 rounded-2xl border border-[#f0e6e3] dark:border-gray-800 bg-[#FCFDFD] dark:bg-black/40">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Unable to load upcoming events right now.
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

      {status === 'ready' && events.length === 0 && (
        <div className="w-full max-w-md flex flex-col items-center text-center py-10 px-6 rounded-2xl border border-[#f0e6e3] dark:border-gray-800 bg-[#FCFDFD] dark:bg-black/40">
          <CalendarX className="w-8 h-8 text-[#c84c30]/40 mb-3" aria-hidden="true" />
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-1.5">
            No Upcoming Events
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            We're preparing something exciting. Check back soon for new events and opportunities.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#c84c30] hover:bg-[#b04027] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84c30] focus-visible:ring-offset-2"
          >
            Explore Events
          </Link>
        </div>
      )}

      {status === 'ready' && events.length > 0 && (
        <>
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
            {events.map((event, i) => (
              <div key={event.id} className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                <EventCard event={event} delay={i * 80} />
              </div>
            ))}
          </div>

          <div className="w-full max-w-4xl mt-16 rounded-3xl bg-cozy-dark px-8 py-10 md:py-12 flex flex-col items-center text-center">
            <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-6">
              Don't see an event you like?
            </h3>
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-cozy-light text-cozy-dark text-sm font-sans font-semibold hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cozy-dark"
            >
              View All Events
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </ScrollReveal>
  )
}
