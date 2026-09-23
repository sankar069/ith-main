import React from 'react'
import { motion } from 'framer-motion'

export default function DesktopIcon({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-center justify-start w-20 sm:w-24 text-center group cursor-pointer"
    >
      <span className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl flex items-center justify-center bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_6px_18px_-8px_rgba(0,0,0,0.5)] transition-shadow duration-300 group-hover:shadow-[0_12px_24px_-10px_rgba(200,76,48,0.35)] overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 pointer-events-none" />
        <Icon
          className="w-6 h-6 md:w-7 md:h-7 text-cozy-primary dark:text-[#ff9d9d] group-hover:text-[#c84c30] dark:group-hover:text-[#ff8a6a] transition-colors relative z-10"
          strokeWidth={1.75}
        />
      </span>
      <div className="w-full mt-2 h-9 md:h-10">
        <p className="w-full h-full flex items-center justify-center font-sans text-center text-[10px] md:text-xs font-semibold leading-snug text-cozy-dark dark:text-cozy-light bg-white/80 dark:bg-black/50 backdrop-blur-md px-1.5 rounded-md shadow-sm border border-white/40 dark:border-white/10">
          {label}
        </p>
      </div>
    </motion.button>
  )
}
