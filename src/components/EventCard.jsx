import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, ImageOff, ArrowRight } from 'lucide-react'
import { formatEventDateRange, eventVenueLabel } from '../lib/eventDisplay'
import { useStudentStore } from '../store/useStudentStore'

export default function EventCard({ event, delay = 0 }) {
  const isAuthenticated = useStudentStore((s) => !!s.token)
  const registerTo = isAuthenticated ? '/dashboard?tab=explore-events' : '/login'

  return (
    <div
      className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden group animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#c84c30]/15 to-[#8ab4f8]/15">
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt={event.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-[#c84c30]/40" aria-hidden="true" />
          </div>
        )}
        {event.category && (
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 dark:bg-black/70 text-cozy-dark dark:text-cozy-light shadow-sm">
            {event.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-serif font-bold text-lg text-cozy-dark dark:text-cozy-light mb-2.5 line-clamp-2 leading-snug">
          {event.name}
        </h3>

        <div className="flex flex-col gap-1.5 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#c84c30] shrink-0" aria-hidden="true" />
            {formatEventDateRange(event.start_date, event.end_date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c84c30] shrink-0" aria-hidden="true" />
            <span className="truncate">{eventVenueLabel(event)}</span>
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-5 flex-1">
          {event.description || 'Details coming soon.'}
        </p>

        <div className="flex items-center gap-2 mt-auto">
          <Link
            to={`/events/${event.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-11 px-3 py-2.5 rounded-xl text-xs font-bold text-cozy-dark dark:text-cozy-light border border-gray-200 dark:border-white/10 hover:border-[#c84c30] hover:text-[#c84c30] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84c30] focus-visible:ring-offset-2"
          >
            View Details
          </Link>
          <Link
            to={registerTo}
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-11 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#c84c30] hover:bg-[#b04027] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84c30] focus-visible:ring-offset-2"
          >
            Register Now <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
