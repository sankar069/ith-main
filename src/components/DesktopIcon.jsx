import React from 'react'

export default function DesktopIcon({ icon: Icon, label, onClick }) {
  return (
    <div 
      className="flex flex-col items-center justify-center w-32 mx-4 mt-4 mb-2 no-underline group text-center"
      onClick={onClick}
    >
      <button className="bg-white/80 dark:bg-black/50 border-2 border-cozy-dark/10 dark:border-cozy-light/10 duration-200 cursor-pointer hover:scale-105 active:scale-95 drop-shadow-flat hover:drop-shadow-flat-hover rounded-xl w-16 h-16 flex items-center justify-center transition-all">
        <Icon className="w-8 h-8 text-cozy-primary group-hover:text-cozy-accent transition-colors" />
      </button>
      <p className="font-mono text-center text-sm mt-2 font-bold bg-white/60 dark:bg-black/40 px-2 py-0.5 rounded-md shadow-sm">
        {label}
      </p>
    </div>
  )
}
