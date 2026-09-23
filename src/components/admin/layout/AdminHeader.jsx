import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Moon, Sun, ChevronRight, ShieldCheck } from 'lucide-react'
import { useAdmin } from '../../../contexts/AdminContext'
import { useAdminStore } from '../../../store/useAdminStore'
import { useAppStore } from '../../../store/useAppStore'

export default function AdminHeader() {
  const { isMobile, sidebarOpen, setSidebarOpen, breadcrumb } = useAdmin()
  const admin = useAdminStore((s) => s.admin)
  const { isDarkMode, toggleDarkMode } = useAppStore()

  return (
    <header className="sticky top-0 bg-white dark:bg-[#1a1f26] border-b border-gray-200 dark:border-[#404854] z-20">
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3">
        {/* Left: mobile menu + breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors shrink-0"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-cozy-dark dark:text-cozy-light" />
            </button>
          )}

          <nav className="flex items-center gap-1.5 text-sm min-w-0 overflow-x-auto">
            {breadcrumb.map((crumb, i) => {
              const isLast = i === breadcrumb.length - 1
              return (
                <React.Fragment key={`${crumb.label}-${i}`}>
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                  {crumb.path && !isLast ? (
                    <Link
                      to={crumb.path}
                      className="text-gray-500 dark:text-gray-400 hover:text-[#c84c30] transition-colors whitespace-nowrap"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={`whitespace-nowrap ${
                        isLast ? 'font-bold text-cozy-dark dark:text-cozy-light' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              )
            })}
          </nav>
        </div>

        {/* Right: dark mode + admin identity */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-[#404854]">
            <div className="w-8 h-8 rounded-full bg-[#c84c30]/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#c84c30]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-cozy-dark dark:text-cozy-light truncate max-w-[160px]">
                {admin?.email}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">{admin?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
