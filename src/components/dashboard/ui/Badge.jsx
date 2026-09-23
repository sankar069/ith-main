import React from 'react'

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-semibold rounded-full'

  const variants = {
    primary: 'bg-[#c84c30]/10 text-[#c84c30]',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-xs',
    lg: 'px-3 py-2 text-sm',
  }

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  )
}

export const Skeleton = ({
  className = '',
  count = 1,
  height = '20px',
  width = '100%',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded mb-3 ${className}`}
          style={{ height, width }}
        />
      ))}
    </>
  )
}

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg p-4 md:p-6">
    <Skeleton height="24px" width="60%" className="mb-4" />
    <Skeleton height="16px" width="100%" count={3} className="mb-2" />
    <div className="mt-4 flex gap-2">
      <Skeleton height="36px" width="80px" />
      <Skeleton height="36px" width="80px" />
    </div>
  </div>
)
