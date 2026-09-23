import React from 'react'

export const Input = ({
  label,
  error,
  required,
  helperText,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}

        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 rounded-lg border transition-all font-sans
            bg-white dark:bg-[#1a1f26]
            text-cozy-dark dark:text-cozy-light
            border-gray-300 dark:border-gray-600
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#c84c30] focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
}

export const Select = ({
  label,
  error,
  required,
  options,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        className={`w-full px-3 py-2.5 rounded-lg border transition-all font-sans
          bg-white dark:bg-[#1a1f26]
          text-cozy-dark dark:text-cozy-light
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-[#c84c30] focus:border-transparent
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50
        `}
        {...props}
      >
        <option value="">Select an option</option>
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}

export const Textarea = ({
  label,
  error,
  required,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        className={`w-full px-3 py-2.5 rounded-lg border transition-all font-sans
          bg-white dark:bg-[#1a1f26]
          text-cozy-dark dark:text-cozy-light
          border-gray-300 dark:border-gray-600
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-[#c84c30] focus:border-transparent
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50
          resize-none
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
