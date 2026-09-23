import React from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
}

const STYLES = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
}

export default function AdminToastCenter() {
  const { toasts, removeToast } = useAdmin()

  return (
    <div className="fixed top-4 right-4 z-[60] space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto border rounded-lg p-4 flex items-start gap-3 shadow-lg animate-slide-in ${STYLES[t.type]}`}
        >
          {ICONS[t.type]}
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button onClick={() => removeToast(t.id)} className="hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
