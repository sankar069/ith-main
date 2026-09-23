import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from '../ui'
import { Trophy, Award, Sparkles, Calendar, Zap, Target } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { useStudentStore } from '../../../store/useStudentStore'
import { studentFetch, StudentApiError } from '../../../lib/studentApi'
import { computeXp, getLevelInfo, nextMilestoneText } from '../../../lib/xp'

export default function OverviewTab() {
  const { addNotification } = useDashboard()
  const profile = useStudentStore((s) => s.profile)

  const [registrations, setRegistrations] = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [eventsData, certsData] = await Promise.all([
        studentFetch('/api/student/events'),
        studentFetch('/api/student/certificates'),
      ])
      setRegistrations(eventsData.registrations || [])
      setCertificates(certsData.certificates || [])
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to load your overview.', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const earnedCertCount = certificates.filter((c) => c.status === 'earned').length
  const xp = computeXp({ registrations: registrations.length, certificates: earnedCertCount })
  const levelInfo = getLevelInfo(xp)

  const stats = [
    {
      id: 'events',
      label: 'Events Registered',
      value: registrations.length,
      icon: Calendar,
      color: 'from-[#c84c30] to-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      id: 'certs',
      label: 'Certificates Earned',
      value: certificates.filter((c) => c.status === 'earned').length,
      icon: Award,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ]

  // Merge events + certificates into one chronological activity feed.
  const activity = [
    ...registrations.map((r) => ({
      id: `reg-${r.id}`,
      icon: '📅',
      title: r.event?.name || 'Event registration',
      desc: 'Registered for this event',
      date: r.registered_at,
    })),
    ...certificates
      .filter((c) => c.status === 'earned' && c.earned_date)
      .map((c) => ({
        id: `cert-${c.id}`,
        icon: '🏆',
        title: c.title,
        desc: `Certificate earned from ${c.issuer || 'InnoTech-Hub'}`,
        date: c.earned_date,
      })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light mb-2">
          🎓 {profile?.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}!` : 'Your Innovation Passport'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your growth, achievements, and learning journey at InnoTech-Hub
        </p>
      </div>

      {/* Level & XP */}
      {!loading && (
        <Card className="bg-gradient-to-br from-[#c84c30]/5 to-[#8ab4f8]/5 border-[#c84c30]/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#c84c30] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-cozy-dark dark:text-cozy-light">Level {levelInfo.level}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{levelInfo.xp} XP total</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP
              </p>
            </div>
            <div className="w-full h-2.5 bg-white/60 dark:bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c84c30] to-[#eebf3f] rounded-full transition-all duration-700"
                style={{ width: `${levelInfo.progressPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Milestone */}
      {!loading && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="pt-4 flex items-start gap-3">
            <Target className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">Next Milestone</p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-0.5">{nextMilestoneText(levelInfo.xpToNextLevel)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <Skeleton height="100px" count={2} />
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.id} className="hover:shadow-lg transition-all">
                <CardContent className={`pt-4 ${stat.bgColor}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#c84c30]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton height="20px" count={4} />
          ) : activity.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Sparkles className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400">
                Nothing here yet — register for an event to start building your passport.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-cozy-dark dark:text-cozy-light">{item.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
