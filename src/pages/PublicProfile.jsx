import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Award, Calendar, FolderCheck, GraduationCap, ShieldCheck, Zap, ArrowLeft } from 'lucide-react'
import SkillsRadarChart from '../components/SkillsRadarChart'
import { computeXp, getLevelInfo } from '../lib/xp'

export default function PublicProfile() {
  const { id } = useParams()
  const [state, setState] = useState('loading') // loading | ready | not_found
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    fetch(`/api/profile/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setState('not_found')
          return
        }
        const data = await res.json()
        setProfile(data.profile)
        setStats(data.stats)
        setCertificates(data.certificates || [])
        setState('ready')
      })
      .catch(() => setState('not_found'))
  }, [id])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading profile…</div>
      </div>
    )
  }

  if (state === 'not_found') {
    return (
      <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark flex flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldCheck className="w-12 h-12 text-gray-300 dark:text-gray-700" />
        <h1 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">This profile isn't public</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          It may be private, or the link is incorrect. If this is your profile, enable public sharing from Settings.
        </p>
        <Link to="/" className="text-[#c84c30] font-semibold hover:underline">← Back to InnoTech-Hub</Link>
      </div>
    )
  }

  const xp = computeXp({
    registrations: stats.eventsRegistered,
    certificates: stats.certificatesEarned,
    projectsSubmitted: stats.projectsSubmitted,
  })
  const levelInfo = getLevelInfo(xp)

  const skillCounts = {}
  certificates.forEach((c) => (c.skills || []).forEach((s) => { skillCounts[s] = (skillCounts[s] || 0) + 1 }))
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxCount = topSkills.length ? topSkills[0][1] : 1
  const radarSkills = topSkills.map(([label, count]) => ({ label, value: count / maxCount }))

  return (
    <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark">
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-cozy-dark dark:text-cozy-light hover:text-[#c84c30] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#c84c30] flex items-center justify-center">
              <span className="text-white font-bold text-xs">IH</span>
            </div>
            InnoTech-Hub
          </Link>
          <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#c84c30] flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Explore InnoTech-Hub
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Identity Card */}
        <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c84c30] to-[#eebf3f] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {(profile.full_name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">{profile.full_name}</h1>
          {(profile.college || profile.graduation_year) && (
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5 mt-1">
              <GraduationCap className="w-4 h-4" />
              {[profile.college, profile.graduation_year].filter(Boolean).join(' · ')}
            </p>
          )}
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-[#c84c30]/10 text-[#c84c30] text-sm font-bold">
            <Zap className="w-4 h-4" /> Level {levelInfo.level} Innovator
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-xl p-4 text-center">
            <Calendar className="w-5 h-5 text-[#c84c30] mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">{stats.eventsRegistered}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Events</p>
          </div>
          <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-xl p-4 text-center">
            <Award className="w-5 h-5 text-[#c84c30] mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">{stats.certificatesEarned}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Certificates</p>
          </div>
          <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-xl p-4 text-center">
            <FolderCheck className="w-5 h-5 text-[#c84c30] mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">{stats.projectsSubmitted}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
          </div>
        </div>

        {/* Skills Radar */}
        {radarSkills.length >= 3 ? (
          <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-2xl p-6">
            <h2 className="font-bold text-cozy-dark dark:text-cozy-light mb-4">Skills Radar</h2>
            <div className="max-w-sm mx-auto">
              <SkillsRadarChart skills={radarSkills} />
            </div>
          </div>
        ) : topSkills.length > 0 && (
          <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-2xl p-6">
            <h2 className="font-bold text-cozy-dark dark:text-cozy-light mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {topSkills.map(([label]) => (
                <span key={label} className="px-3 py-1.5 rounded-full bg-[#c84c30]/10 text-[#c84c30] text-sm font-semibold">{label}</span>
              ))}
            </div>
          </div>
        )}

        {/* Verified Badge Gallery */}
        <div>
          <h2 className="font-bold text-cozy-dark dark:text-cozy-light mb-4">Verified Achievements</h2>
          {certificates.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No certificates earned yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-cozy-dark dark:text-cozy-light text-sm">{cert.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuer || 'InnoTech-Hub'}</p>
                    {cert.earned_date && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(cert.earned_date).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-xs text-gray-400 dark:text-gray-600">
        Powered by <Link to="/" className="text-[#c84c30] hover:underline">InnoTech-Hub</Link>
      </footer>
    </div>
  )
}
