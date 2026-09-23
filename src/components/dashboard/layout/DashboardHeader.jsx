import React from 'react'
import { Bell, Moon, Sun, User } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { Badge } from '../ui'

export default function DashboardHeader() {
  const { user, notifications, isMobile } = useDashboard()
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  return (
    <header className="sticky top-0 bg-white dark:bg-[#1a1f26] border-b border-gray-200 dark:border-[#404854] z-20">
      <div className={`flex items-center justify-between px-4 md:px-6 py-4 ${isMobile ? 'ml-0' : 'ml-64'}`}>
        {/* Left: Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-cozy-dark dark:text-cozy-light">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {notifications.length > 0 && (
                <Badge
                  variant="primary"
                  size="sm"
                  className="absolute -top-1 -right-1"
                >
                  {notifications.length}
                </Badge>
              )}
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">
                {user?.fullName || 'Student'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.headline || 'Profile Setup Pending'}
              </p>
            </div>

            <button className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
