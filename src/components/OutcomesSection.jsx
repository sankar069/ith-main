import React from 'react'
import { GraduationCap, School, Users, Briefcase } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

export default function OutcomesSection() {
  const cards = [
    {
      icon: GraduationCap,
      title: "For Students",
      bullets: [
        "Discover meaningful events",
        "Affordable practical sessions",
        "Build & submit projects",
        "Earn verified certificates",
        "Track skill growth",
        "Find teammates",
        "Learn from achievers"
      ]
    },
    {
      icon: School,
      title: "For Colleges",
      bullets: [
        "Better documentation",
        "Workforce tracking",
        "Faculty workflow support",
        "Reduced manual work",
        "Inspection readiness",
        "Digital transformation",
        "Analytics & reports"
      ]
    },
    {
      icon: Users,
      title: "For Clubs/Teams",
      bullets: [
        "Replace WhatsApp chaos",
        "Assign and track work",
        "Manage members",
        "Verify completion",
        "Run events professionally"
      ]
    },
    {
      icon: Briefcase,
      title: "For Sponsors",
      bullets: [
        "Direct student reach",
        "Event visibility",
        "Brand placement",
        "Audience analytics",
        "Long-term partnership",
        "Strategic investment opportunity"
      ]
    }
  ]

  return (
    <ScrollReveal className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> OUTCOMES
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-14 text-center leading-tight">
        Built to <span className="text-[#c84c30] italic font-serif">Benefit Everyone</span>
      </h2>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <ScrollReveal key={i} delay={i * 130}>
              <div className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#c84c30]/10 dark:bg-[#c84c30]/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#c84c30] stroke-[1.8]" />
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-5">
                  {card.title}
                </h3>

                {/* Bullets */}
                <div className="flex flex-col gap-2.5">
                  {card.bullets.map((b, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30] shrink-0 mt-1.5"></span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </ScrollReveal>
  )
}
