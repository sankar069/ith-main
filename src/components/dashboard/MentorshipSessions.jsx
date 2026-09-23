import React from 'react'
import { Calendar, Clock, User, Video, Bell } from 'lucide-react'

export default function MentorshipSessions() {
  const sessions = [
    { id: 1, title: 'Full-Stack Development Best Practices', speaker: 'John Doe', date: 'Sep 8, 2024', time: '3:00 PM', duration: '45 mins', category: 'Technical' },
    { id: 2, title: 'Career Growth Strategies', speaker: 'Jane Smith', date: 'Sep 10, 2024', time: '5:00 PM', duration: '30 mins', category: 'Career' },
    { id: 3, title: 'AI/ML Fundamentals', speaker: 'Dr. Ahmed', date: 'Sep 12, 2024', time: '4:00 PM', duration: '60 mins', category: 'AI/ML' },
  ]

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-cozy-light to-gray-50 dark:from-cozy-dark dark:to-[#1a1f26]">
      
      <h1 className="text-3xl font-serif font-bold text-cozy-dark dark:text-white">Expert Sessions</h1>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white dark:bg-[#1a1f26] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-cozy-dark dark:text-white">{session.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
                  <User className="w-4 h-4" /> {session.speaker}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                {session.category}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {session.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {session.time}
              </span>
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4" /> {session.duration}
              </span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-[#c84c30] text-white rounded-lg font-semibold hover:bg-[#b84027] transition">
                RSVP
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-center gap-2">
                <Bell className="w-4 h-4" /> Remind
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
