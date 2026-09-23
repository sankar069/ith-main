import React from 'react'
import { X } from 'lucide-react'

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeButton = true,
  footer,
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white dark:bg-[#1a1f26] rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1f26] border-b border-gray-200 dark:border-[#404854] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-cozy-dark dark:text-cozy-light">
            {title}
          </h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 dark:border-[#404854] px-6 py-4 bg-gray-50 dark:bg-[#0f1419] flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'w-96',
}) => {
  if (!isOpen) return null

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 ${positionClasses[position]} h-screen ${width} bg-white dark:bg-[#1a1f26] shadow-2xl overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1f26] border-b border-gray-200 dark:border-[#404854] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-cozy-dark dark:text-cozy-light">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
