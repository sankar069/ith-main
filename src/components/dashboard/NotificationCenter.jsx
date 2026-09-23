import React from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useDashboard } from '../../contexts/DashboardContext'

export default function NotificationCenter() {
  const { notifications, removeNotification } = useDashboard()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-900 dark:text-green-100'
      case 'error':
        return 'text-red-900 dark:text-red-100'
      case 'info':
        return 'text-blue-900 dark:text-blue-100'
      default:
        return 'text-blue-900 dark:text-blue-100'
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 flex items-start gap-3 shadow-lg animate-slide-in ${getBgColor(notification.type)}`}
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className={`text-sm font-medium ${getTextColor(notification.type)}`}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className={`${getTextColor(notification.type)} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
