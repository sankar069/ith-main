import React from 'react'

export const Card = ({
  children,
  className = '',
  hover = true,
  padding = true,
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg shadow-sm transition-all'
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-[#565f73]' : ''
  const paddingClasses = padding ? 'p-4 md:p-6' : ''

  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg md:text-xl font-bold text-cozy-dark dark:text-cozy-light ${className}`}>
    {children}
  </h3>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 ${className}`}>
    {children}
  </div>
)
