import React, { useState } from 'react'
import { Zap, Award, Code, Users, Calendar, ChevronRight } from 'lucide-react'

export default function DashboardOverview() {
  const [_profileCompleteness] = useState(72)

  // Mock data for growth tracker
  const growthMetrics = [
    { label: 'Technical', value: 78, color: '#c84c30' },
    { label: 'Managerial', value: 65, color: '#8ab4f8' },
    { label: 'Problem Solving', value: 82, color: '#fbbf24' },
    { label: 'AI Literacy', value: 58, color: '#10b981' },
  ]

  // Action cards
  const actionCards = [
    { icon: Zap, label: 'Active Events', value: '7', subtext: 'Participate now', color: 'from-orange-400 to-red-500' },
    { icon: Code, label: 'Projects', value: '3', subtext: 'Submissions', color: 'from-blue-400 to-blue-600' },
    { icon: Award, label: 'Certificates', value: '12', subtext: 'Verified', color: 'from-purple-400 to-pink-500' },
    { icon: Zap, label: 'AI Credits', value: '450', subtext: 'Points earned', color: 'from-green-400 to-emerald-600' },
  ]

  // Upcoming milestones
  const milestones = [
    { type: 'Event', title: 'HackFest 2024', date: 'Sep 15, 2024', status: 'Upcoming', icon: Calendar },
    { type: 'Project', title: 'AI Tool Hackathon - Submission', date: 'Sep 10, 2024', status: 'Deadline Soon', icon: Code },
    { type: 'Session', title: 'Expert Session: ML in Production', date: 'Sep 8, 2024', status: 'This Week', icon: Users },
    { type: 'Certificate', title: 'Cloud Computing Certification', date: 'Sep 12, 2024', status: 'In Progress', icon: Award },
  ]

  return (
    <div className="p-6 space-y-8 bg-cozy-light dark:bg-cozy-dark">{/* Flat, clean background */}
      
      {/* Hero Section with Profile Completeness */}
      <div className="bg-[#c84c30] rounded-2xl p-8 text-white shadow-lg">{/* Flat color, no gradient */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Welcome back, Satyam! 👋</h1>
            <p className="text-white/90 text-lg">Full-Stack Developer | 2x Hackathon Winner</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm mb-2">Profile Completeness</p>
            <p className="text-4xl font-bold">72%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `72%` }}
          />
        </div>
        <p className="text-white/80 text-sm mt-3">
          Complete 28% more to unlock premium AI features
        </p>
      </div>

      {/* Skill & Growth Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Rings */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1f26] rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-serif font-bold text-cozy-dark dark:text-white mb-8">Skill & Growth Tracker</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {growthMetrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Circular progress */}
                <div className="relative w-24 h-24 mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-white/10" />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={metric.color}
                      strokeWidth="3"
                      strokeDasharray={`${(metric.value / 100) * 283} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: metric.color }}>
                      {metric.value}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-white mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Streak</p>
              <p className="text-3xl font-bold text-[#c84c30] mt-2">14 Days</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Rank</p>
              <p className="text-3xl font-bold text-[#8ab4f8] mt-2">#47</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Total Points</p>
              <p className="text-3xl font-bold text-[#10b981] mt-2">2,850</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actionCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className="bg-[#c84c30] rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-white/20"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8" />
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">{card.label}</span>
              </div>
              <p className="text-4xl font-bold mb-2">{card.value}</p>
              <p className="text-white/80 text-sm">{card.subtext}</p>
            </div>
          )
        })}
      </div>

      {/* Upcoming Milestones Timeline */}
      <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/10">
        <h2 className="text-2xl font-serif font-bold text-cozy-dark dark:text-white mb-8">Upcoming Milestones</h2>

        <div className="space-y-4">
          {milestones.map((milestone, idx) => {
            const MilestoneIcon = milestone.icon
            const statusColors = {
              'Upcoming': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
              'Deadline Soon': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
              'This Week': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
              'In Progress': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            }

            return (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition group">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MilestoneIcon className="w-6 h-6 text-[#c84c30]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{milestone.type}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusColors[milestone.status] || statusColors['Upcoming']}`}>
                      {milestone.status}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{milestone.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{milestone.date}</p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-[#c84c30] transition" />
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
