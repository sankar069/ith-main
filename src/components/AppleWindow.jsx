import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Draggable from 'react-draggable'

export default function AppleWindow({ title, isOpen, onClose, children }) {
  const nodeRef = useRef(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 sm:p-6">
      <Draggable handle=".apple-window-handle" bounds="parent" nodeRef={nodeRef}>
        <div ref={nodeRef} className="pointer-events-auto w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.012 }}
            style={{ willChange: 'transform' }}
            className="relative flex flex-col max-h-[85vh] overflow-hidden rounded-[20px] border border-white/40 dark:border-white/10 bg-white/75 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl shadow-[0_25px_70px_-20px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.7)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-18px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_30px_80px_-18px_rgba(0,0,0,0.75)]"
          >
            {/* Title Bar */}
            <div className="apple-window-handle cursor-move grid grid-cols-[58px_1fr_58px] items-center gap-2 px-4 py-3 border-b border-black/5 dark:border-white/10 bg-gradient-to-b from-white/60 to-white/20 dark:from-white/10 dark:to-white/0">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  aria-label="Close"
                  className="group w-3.5 h-3.5 rounded-full bg-[#ff5f57] flex items-center justify-center hover:brightness-95 active:brightness-90 transition-all"
                >
                  <X className="w-2 h-2 text-[#4d0000] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3.5} />
                </button>
                <span className="w-3.5 h-3.5 rounded-full bg-[#febc2e]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-center text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 font-sans select-none truncate">
                {title}
              </span>
              <span aria-hidden="true" />
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      </Draggable>
    </div>
  )
}
