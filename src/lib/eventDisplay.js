// Shared display helpers for public-facing event UI (Home page Upcoming
// Events section, the public event detail page). Pure formatting only — no
// data fetching or business logic lives here, so there's exactly one place
// that decides how a raw `events` row reads on screen.

export function formatEventDate(dateString) {
  if (!dateString) return 'Date TBA'
  const d = new Date(dateString)
  const day = d.getDate()
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatEventDateRange(startDate, endDate) {
  if (!startDate && !endDate) return 'Date TBA'
  if (startDate && endDate && startDate !== endDate) {
    return `${formatEventDate(startDate)} – ${formatEventDate(endDate)}`
  }
  return formatEventDate(startDate || endDate)
}

export function eventVenueLabel(event) {
  if (event.venue_type === 'online') return 'Online Event'
  if (event.venue_address) return event.venue_address
  if (event.venue_type === 'hybrid') return 'Hybrid Event'
  return 'Venue TBA'
}

// "Upcoming" excludes only events with a *known* start date in the past —
// an event with no date set yet (date TBD) can't be judged expired, so it
// stays visible rather than silently disappearing from the Home page. This
// mirrors how the student dashboard's Explore Events tab already treats a
// missing start_date (falls back to "Date TBA" instead of hiding the event).
export function isUpcomingEvent(event, now = Date.now()) {
  if (!event.start_date) return true
  return new Date(event.start_date).getTime() >= now
}
