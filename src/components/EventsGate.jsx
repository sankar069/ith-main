import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { LogIn, UserPlus } from 'lucide-react'
import OfficialEventPlatformSection from './OfficialEventPlatformSection'
import EventFlowSection from './EventFlowSection'
import EventsTelemetry from './EventsTelemetry'
import GrowthDashboardSection from './GrowthDashboardSection'

export default function EventsGate() {
  const navigate = useNavigate()
  const { isLoggedIn, openModal } = useAppStore()

  // If user is logged in, show the full events dashboard
  if (isLoggedIn) {
    return (
      <>
        <section id="events" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
          <OfficialEventPlatformSection />
        </section>
        <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
          <EventFlowSection />
        </section>
        <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
          <EventsTelemetry />
        </section>
        <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
          <GrowthDashboardSection />
        </section>
      </>
    )
  }

  // If user is not logged in, show login/signup prompt
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        {/* Content Card */}
        <div className="bg-white dark:bg-cozy-dark border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 shadow-sm text-center">
          
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c84c30]/10 dark:bg-[#c84c30]/20 mb-6">
            <LogIn className="w-8 h-8 text-[#c84c30]" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4">
            Access Events Dashboard
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Sign in to your InnoTech-Hub account to explore events, register for competitions, and manage your journey with us.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#c84c30] hover:bg-[#b04027] text-white font-semibold transition-colors shadow-sm"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-cozy-dark dark:text-cozy-light font-semibold transition-all shadow-sm hover:shadow"
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-cozy-dark text-gray-600 dark:text-gray-400">or</span>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Want to explore without signing up?
            </p>
            <button
              onClick={() => openModal('demo')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm"
            >
              View Demo Content
            </button>
          </div>

          {/* Security Info */}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-8">
            🔒 Your data is secure. We never share your information with third parties.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Trusted by 90+ colleges across India
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
              ✓ Verified Platform
            </div>
            <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
              ✓ Secure Registration
            </div>
            <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
              ✓ Instant Certificates
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
