import React from 'react'

export default function Mascot() {
  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none animate-bobbing hidden md:block">
      <div className="relative pointer-events-auto group">
        {/* Speech Bubble */}
        <div className="absolute bottom-full right-1/2 mb-4 w-48 bg-white dark:bg-cozy-dark border-2 border-cozy-dark/20 dark:border-cozy-light/20 p-3 rounded-2xl rounded-br-none drop-shadow-flat opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs font-mono font-bold">
            ribbit! click an icon to explore your dashboard or events!
          </p>
        </div>
        
        {/* Mascot Body (Placeholder Frog) */}
        <button className="w-24 h-24 bg-green-400 border-4 border-white drop-shadow-flat-hover rounded-[40px] flex items-center justify-center hover:-translate-y-2 transition-transform cursor-pointer">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
          <div className="absolute bottom-4 w-8 h-2 bg-pink-300 rounded-full"></div>
        </button>
      </div>
    </div>
  )
}
