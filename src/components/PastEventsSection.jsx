import React, { useCallback, useEffect, useState } from 'react'
import { CalendarX, RotateCw, Images } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import AppleWindow from './AppleWindow'
import PastEventCard from './PastEventCard'
import EventCardSkeleton from './EventCardSkeleton'

const MAX_EVENTS = 6

export default function PastEventsSection() {
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [selectedEvent, setSelectedEvent] = useState(null)

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      // Same public /api/events endpoint the Upcoming Events section and
      // student "Explore Events" tab use — just scoped to completed events
      // via the (additive, backward-compatible) ?status= param.
      const res = await fetch('/api/events?status=completed')
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setEvents((data.events || []).slice(0, MAX_EVENTS))
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
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> PAST EVENTS
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 text-center leading-tight">
        Moments We've <span className="text-[#c84c30] italic font-serif">Created</span>
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-14 max-w-2xl leading-relaxed">
        A look back at the hackathons, fests, and gatherings that brought the InnoTech Hub community together.
      </p>

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
            Unable to load past events right now.
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
            No Past Events Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Our story is just getting started — check back after our next event.
          </p>
        </div>
      )}

      {status === 'ready' && events.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
          {events.map((event, i) => (
            <div key={event.id} className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
              <PastEventCard
                event={event}
                delay={i * 80}
                onViewMedia={() => setSelectedEvent(event)}
              />
            </div>
          ))}
        </div>
      )}

      <AppleWindow
        title={selectedEvent ? `${selectedEvent.name} — Media` : 'Event Media'}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      >
        <div className="flex flex-col items-center text-center py-6 px-2">
          <Images className="w-10 h-10 text-[#c84c30]/40 mb-4" aria-hidden="true" />
          <p className="text-sm font-bold text-cozy-dark dark:text-cozy-light mb-1.5">
            Media Coming Soon
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Photos and highlights from {selectedEvent?.name} will be added here shortly.
          </p>
        </div>
      </AppleWindow>
    </ScrollReveal>
  )
}
