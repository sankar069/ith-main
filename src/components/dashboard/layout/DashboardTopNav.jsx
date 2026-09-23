import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Search, Bell, Settings, LogOut, Menu, X, Moon, Sun, Zap } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { useAppStore } from '../../../store/useAppStore'
import { useStudentStore } from '../../../store/useStudentStore'
import { studentFetch } from '../../../lib/studentApi'
import { computeXp, getLevelInfo } from '../../../lib/xp'

function initialsOf(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase()
}

export default function DashboardTopNav() {
  const navigate = useNavigate()
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile } = useDashboard()
  const { isDarkMode, toggleDarkMode } = useAppStore()
  const profile = useStudentStore((s) => s.profile)
  const logout = useStudentStore((s) => s.logout)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [level, setLevel] = useState(null)

  useEffect(() => {
    Promise.all([
      studentFetch('/api/student/events').catch(() => ({ registrations: [] })),
      studentFetch('/api/student/certificates').catch(() => ({ certificates: [] })),
    ]).then(([eventsData, certsData]) => {
      const xp = computeXp({
        registrations: (eventsData.registrations || []).length,
        certificates: (certsData.certificates || []).filter((c) => c.status === 'earned').length,
      })
      setLevel(getLevelInfo(xp).level)
    }).catch(() => {})
  }, [])

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'explore-events', label: 'Explore Events' },
    { id: 'my-events', label: 'My Events' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'ai-tools', label: 'AI Suite' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'projects', label: 'Projects' },
    { id: 'billing', label: 'Billing' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-black dark:bg-black text-white sticky top-0 z-50 border-b border-gray-800">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Logo & Hamburger */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          <a href="/" className="flex items-center gap-2 font-bold text-lg hover:text-[#c84c30] transition-colors">
            <div className="w-8 h-8 rounded bg-[#c84c30] flex items-center justify-center">
              <span className="text-white font-bold text-sm">IH</span>
            </div>
            <span className="hidden sm:inline">InnoTech-Hub</span>
          </a>
        </div>

        {/* Center: Navigation (Desktop) */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-[#c84c30] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Right: Search, Notifications, User Menu */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                onBlur={() => setSearchOpen(false)}
                className="bg-gray-900 text-white px-4 py-2 rounded w-48 text-sm focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
              />
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Level badge */}
          {level !== null && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c84c30]/15 border border-[#c84c30]/30 text-[#c84c30] text-xs font-bold">
              <Zap className="w-3.5 h-3.5" /> Level {level}
            </div>
          )}

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-900 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#c84c30] rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-[#c84c30] flex items-center justify-center text-sm font-bold">
                {initialsOf(profile?.full_name)}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <p className="text-sm font-semibold text-white">{profile?.full_name || 'Student'}</p>
                  <p className="text-xs text-gray-400">{profile?.email || ''}</p>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings')
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors">
                    <span>Profile</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors">
                    <span>Leaderboard</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors">
                    <span>Bookmarks</span>
                  </button>

                  <hr className="border-gray-800 my-1" />

                  {/* Dark/Light Mode Toggle */}
                  <button
                    onClick={() => toggleDarkMode()}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>

                  <hr className="border-gray-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Second Row) */}
      {isMobile && (
        <div className="border-t border-gray-800 px-4 py-2 overflow-x-auto">
          <div className="flex gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-[#c84c30] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
