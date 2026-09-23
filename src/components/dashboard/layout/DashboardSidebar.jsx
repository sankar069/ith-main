import React from 'react'
import { LogOut, Menu } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { dashboardNavigation, sidebarSections } from '../navigationConfig'

export default function DashboardSidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile } = useDashboard()

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-[#1a1f26] border-r border-gray-200 dark:border-[#404854] z-40 transition-transform duration-300 overflow-y-auto custom-scrollbar ${
          isMobile
            ? sidebarOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full w-64'
            : 'translate-x-0 w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1f26] border-b border-gray-200 dark:border-[#404854] px-4 py-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#c84c30] flex items-center justify-center">
              <span className="text-white font-bold text-sm">IH</span>
            </div>
            <span className="font-serif font-bold text-cozy-dark dark:text-cozy-light">Dashboard</span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-1 p-4">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-3 py-2">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((itemId) => {
                    const item = dashboardNavigation.find(nav => nav.id === itemId)
                    if (!item) return null

                    const Icon = item.icon
                    const isActive = activeTab === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id)
                          if (isMobile) setSidebarOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-[#c84c30] text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'}`}>
                            {item.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 dark:border-[#404854] p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-30 p-2 bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-cozy-dark dark:text-cozy-light" />
        </button>
      )}
    </>
  )
}
