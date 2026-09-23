import React from 'react'

export default function EventCardSkeleton() {
  return (
    <div
      className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-2xl overflow-hidden h-full flex flex-col animate-pulse"
      aria-hidden="true"
    >
      <div className="w-full aspect-[16/10] bg-gray-200 dark:bg-white/10" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="h-5 w-4/5 rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-3 w-2/5 rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-white/10 mt-1" />
        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
        <div className="flex gap-2 mt-auto pt-2">
          <div className="h-9 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
          <div className="h-9 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  )
}
