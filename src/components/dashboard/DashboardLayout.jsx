import React, { useState, useEffect } from 'react'
import { Menu, X, LogOut, Settings, Home, User, Zap, Award, Calendar, DollarSign } from 'lucide-react'

export default function DashboardLayout({ children, activeSection, setActiveSection }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'events', label: 'Events & Arena', icon: Zap },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'ai-suite', label: 'AI Suite', icon: Zap },
    { id: 'mentorship', label: 'Expert Sessions', icon: Calendar },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-cozy-light dark:bg-cozy-dark overflow-hidden">
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-40 h-full w-64 bg-white dark:bg-[#1a1f26] border-r border-gray-200 dark:border-white/10 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c84c30] flex items-center justify-center">
              <span className="text-white font-bold text-sm">IH</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-cozy-dark dark:text-white">InnoTech</h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Student Hub</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5 text-cozy-dark dark:text-cozy-light" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-[#c84c30] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all text-sm font-medium">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-[#1a1f26] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition"
          >
            <Menu className="w-6 h-6 text-cozy-dark dark:text-cozy-light" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg relative transition">
              <span className="relative flex h-3 w-3">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#c84c30]"></span>
              </span>
            </button>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c84c30] to-[#ff6b6b] flex items-center justify-center cursor-pointer hover:shadow-lg transition">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}
