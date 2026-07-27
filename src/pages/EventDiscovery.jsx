import React from 'react'

export default function EventDiscovery() {
  const events = [
    { id: 1, title: 'AI Hackathon 2026', date: 'Oct 15, 2026', type: 'Hackathon', color: 'bg-cozy-primary' },
    { id: 2, title: 'Web3 Builder Workshop', date: 'Nov 2, 2026', type: 'Workshop', color: 'bg-cozy-accent' },
    { id: 3, title: 'Student Tech Summit', date: 'Dec 10, 2026', type: 'Summit', color: 'bg-green-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-xl border-2 border-orange-200 dark:border-orange-800 text-sm font-mono flex items-center gap-3">
        <span className="text-2xl">✨</span>
        <p>AI Recommendation: Based on your recent projects, you might love the <b>AI Hackathon 2026</b>!</p>
      </div>

      <h2 className="font-display font-bold text-2xl">Upcoming Events</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {events.map(event => (
          <div key={event.id} className="relative bg-white dark:bg-black/40 border-2 border-cozy-dark/20 dark:border-cozy-light/20 p-5 rounded-xl drop-shadow-flat hover:-translate-y-1 hover:drop-shadow-flat-hover transition-all group">
            {/* Ticket Notch */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-cozy-light dark:bg-cozy-dark rounded-full border-r-2 border-cozy-dark/20 dark:border-cozy-light/20"></div>
            
            <div className="ml-4">
              <span className={`inline-block px-2 py-1 text-xs font-bold font-mono text-white rounded-md ${event.color} mb-2`}>
                {event.type}
              </span>
              <h3 className="font-bold text-lg leading-tight mb-1">{event.title}</h3>
              <p className="text-sm font-mono text-cozy-dark/60 dark:text-cozy-light/60">{event.date}</p>
              
              <button className="mt-4 w-full py-2 bg-cozy-dark dark:bg-cozy-light text-cozy-light dark:text-cozy-dark rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-transform">
                Register Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
