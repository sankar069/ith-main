import React, { useRef } from 'react'
import { X } from 'lucide-react'
import Draggable from 'react-draggable'

export default function CozyModal({ title, isOpen, onClose, children }) {
  const nodeRef = useRef(null)
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Click outside to close - Removing this so the window acts like an OS window and user can drag multiple / click outside without closing instantly, 
          but if we want standard modal behavior, we can keep it. Since we want OS desktop feel, let's just make the window draggable and require explicit X click. */}
      
      {/* Modal Content */}
      <Draggable handle=".drag-handle" bounds="parent" nodeRef={nodeRef}>
        <div ref={nodeRef} className="relative pointer-events-auto w-full max-w-2xl max-h-[85vh] bg-cozy-light dark:bg-cozy-dark rounded-xl border-4 border-cozy-dark dark:border-cozy-light drop-shadow-[8px_8px_0px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Retro Header Bar (Drag Handle) */}
          <div className="drag-handle cursor-move bg-cozy-dark dark:bg-cozy-light text-cozy-light dark:text-cozy-dark px-4 py-2 flex items-center justify-between border-b-4 border-cozy-dark dark:border-cozy-light">
            <span className="font-mono font-bold tracking-widest">{title}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-cozy-primary hover:text-white rounded-md transition-colors active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white/50 dark:bg-black/20">
            {children}
          </div>
        </div>
      </Draggable>
    </div>
  )
}
