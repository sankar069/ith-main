import React from 'react'
import { LayoutDashboard } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

export default function VisionBannerSection() {
  return (
    <div className="w-full bg-[#f3e2da] dark:bg-[#2a1a14] py-24 md:py-32">
      <ScrollReveal className="max-w-4xl mx-auto flex flex-col items-center text-center px-6">
        {/* Icon */}
        <div className="mb-8">
          <LayoutDashboard className="w-8 h-8 text-[#c84c30] stroke-[1.5]" />
        </div>

        {/* Main Quote */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light leading-snug md:leading-tight mb-6">
          Events bring students in.<br />
          AI tools help them <span className="text-[#c84c30] italic font-serif">grow</span>.<br />
          SaaS helps institutions operate<br />
          <span className="text-[#c84c30] italic font-serif">smarter</span>.
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-sans leading-relaxed max-w-xl">
          InnoTech-Hub connects all three into one future-ready ecosystem.
        </p>
      </ScrollReveal>
    </div>
  )
}
