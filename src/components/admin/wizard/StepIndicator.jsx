import React from 'react'
import { Check } from 'lucide-react'

export default function StepIndicator({ steps, currentStep, furthestStep, onStepClick }) {
  return (
    <div className="flex items-center overflow-x-auto pb-2 mb-6 -mx-1 px-1">
      {steps.map((step, i) => {
        const isActive = i === currentStep
        const isDone = i < currentStep
        const isReachable = i <= furthestStep

        return (
          <React.Fragment key={step}>
            {i > 0 && (
              <div className={`h-0.5 w-6 sm:w-10 shrink-0 ${isDone ? 'bg-[#c84c30]' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
            <button
              type="button"
              onClick={() => isReachable && onStepClick(i)}
              disabled={!isReachable}
              className="flex flex-col items-center gap-1.5 shrink-0 px-1"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-[#c84c30] text-white'
                    : isDone
                    ? 'bg-[#c84c30]/15 text-[#c84c30]'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span
                className={`text-[11px] font-semibold whitespace-nowrap ${
                  isActive ? 'text-cozy-dark dark:text-cozy-light' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step}
              </span>
            </button>
          </React.Fragment>
        )
      })}
    </div>
  )
}
