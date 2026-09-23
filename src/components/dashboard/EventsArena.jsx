import React, { useState } from 'react'
import { Zap, Users, FileText, Trophy, Plus } from 'lucide-react'

export default function EventsArena() {
  const [activeTab, setActiveTab] = useState('live')

  const events = {
    live: [
      { id: 1, title: 'HackFest 2024', organizer: 'InnoTech', format: 'Hackathon', prize: '₹5 Lakhs', status: 'Live Now' },
      { id: 2, title: 'AI Workshop', organizer: 'Dev Community', format: 'Workshop', prize: 'Certificate', status: 'Live Now' },
    ],
    registered: [
      { id: 3, title: 'Cloud Conference', organizer: 'AWS', format: 'Conference', prize: 'N/A', status: 'Registered' },
    ],
    upcoming: [
      { id: 4, title: 'Web3 Bootcamp', organizer: 'BlockTech', format: 'Bootcamp', prize: '₹2 Lakhs', status: 'Sept 15' },
      { id: 5, title: 'ML Challenge', organizer: 'Kaggle Partner', format: 'Challenge', prize: '₹10 Lakhs', status: 'Sept 20' },
    ],
    past: [
      { id: 6, title: 'HackIT 2024', organizer: 'CodeRush', format: 'Hackathon', prize: 'Won 🏆', status: 'Completed' },
    ],
  }

  const tabs = [
    { id: 'live', label: 'Live Now', icon: Zap },
    { id: 'registered', label: 'Registered', icon: Users },
    { id: 'upcoming', label: 'Upcoming', icon: Trophy },
    { id: 'past', label: 'Past Events', icon: FileText },
  ]

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-cozy-light to-gray-50 dark:from-cozy-dark dark:to-[#1a1f26]">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-cozy-dark dark:text-white">Events & Competition Arena</h1>
        <button className="px-4 py-2 bg-[#c84c30] text-white rounded-lg font-semibold hover:bg-[#b84027] transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Explore Events
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#c84c30] border-[#c84c30]'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-cozy-dark dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events[activeTab].map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-[#1a1f26] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-serif font-bold text-lg text-cozy-dark dark:text-white group-hover:text-[#c84c30] transition">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.organizer}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">
                {event.format}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
              <span className="text-sm font-semibold text-[#c84c30]">{event.prize}</span>
              <button className="px-3 py-2 bg-[#c84c30] text-white rounded-lg text-sm font-semibold hover:bg-[#b84027] transition">
                {activeTab === 'live' ? 'Enter Arena' : activeTab === 'registered' ? 'View' : 'Register'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
