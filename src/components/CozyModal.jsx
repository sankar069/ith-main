import React from 'react'
import { X } from 'lucide-react'

export default function CozyModal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-cozy-light dark:bg-cozy-dark rounded-xl border-4 border-cozy-dark dark:border-cozy-light drop-shadow-[8px_8px_0px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Retro Header Bar */}
        <div className="bg-cozy-dark dark:bg-cozy-light text-cozy-light dark:text-cozy-dark px-4 py-2 flex items-center justify-between border-b-4 border-cozy-dark dark:border-cozy-light">
          <span className="font-mono font-bold tracking-widest">{title}</span>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-cozy-primary hover:text-white rounded-md transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
