import React from 'react'
import { X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import JoinUsPricing from './JoinUsPricing'

export default function JoinUsModal({ isOpen, onClose }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSelectPlan = (planId) => {
    onClose()
    navigate(`/login?mode=signup&plan=${planId}`)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 bg-[#0d213b]">
              <img src="/ith-logo.jpg" alt="" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-serif font-bold text-cozy-dark text-sm">InnoTech Hub</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 md:px-10 py-8">
          <JoinUsPricing onSelectPlan={handleSelectPlan} variant="light" />

          <p className="text-center text-xs text-gray-500 font-sans mt-6">
            Already have an account?{' '}
            <Link to="/login" onClick={onClose} className="text-[#c84c30] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
