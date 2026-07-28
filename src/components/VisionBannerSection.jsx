import React from 'react'
import { LayoutDashboard } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import ScrollRevealText from '../components/ScrollRevealText'

export default function VisionBannerSection() {
  return (
    <div className="w-full bg-[#f3e2da] dark:bg-[#2a1a14] py-24 md:py-32">
      <ScrollReveal className="max-w-4xl mx-auto flex flex-col items-center text-center px-6">
        {/* Icon */}
        <div className="mb-8">
          <LayoutDashboard className="w-8 h-8 text-[#c84c30] stroke-[1.5]" />
        </div>

        {/* Main Quote - ScrollRevealText for word-by-word reveal */}
        <ScrollRevealText
          baseOpacity={0}
          enableBlur={true}
          baseRotation={3}
          blurStrength={6}
          containerClassName="mb-6"
          textClassName="!text-3xl md:!text-5xl !font-bold text-cozy-dark dark:text-cozy-light !leading-snug md:!leading-tight"
        >
          Events bring students in. AI tools help them grow. SaaS helps institutions operate smarter.
        </ScrollRevealText>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-sans leading-relaxed max-w-xl">
          InnoTech-Hub connects all three into one future-ready ecosystem.
        </p>
      </ScrollReveal>
    </div>
  )
}
