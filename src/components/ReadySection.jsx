import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

export default function ReadySection() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleJoin = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({ mode: 'signup' })
    if (email.trim()) params.set('email', email.trim())
    navigate(`/login?${params.toString()}`)
  }

  return (
    <div className="w-full bg-cozy-dark py-20 md:py-28 px-4">
      <ScrollReveal className="max-w-2xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-8">
          Ready?
        </h2>

        <form onSubmit={handleJoin} className="w-full flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/10 mb-10">
          <label htmlFor="ready-email" className="sr-only">Email address</label>
          <input
            id="ready-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 min-w-0 bg-transparent px-5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 min-h-11 px-6 py-2.5 rounded-full bg-cozy-light text-cozy-dark text-sm font-sans font-bold hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cozy-dark"
          >
            Join!
          </button>
        </form>

        <p className="text-base md:text-lg font-sans font-semibold text-white mb-6">
          Get started with your innovation journey.
        </p>

        <Link
          to="/events"
          className="group inline-flex items-center gap-2 min-h-11 px-7 py-3.5 rounded-full bg-cozy-light text-cozy-dark text-sm font-sans font-bold hover:bg-white transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cozy-dark"
        >
          Explore Current Events
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>

        <p className="text-xs text-white/60 font-sans italic">
          For all students. By continuing, you agree to our{' '}
          <Link to="/terms-of-service" className="text-[#c84c30] underline hover:text-[#e0806a] transition-colors not-italic font-semibold">
            terms
          </Link>.
        </p>
      </ScrollReveal>
    </div>
  )
}
