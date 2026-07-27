import React from 'react'
import { X, Check } from 'lucide-react'

export default function CultureComparisonSection() {
  const normalEvents = [
    "Attend and leave",
    "Certificate for presence",
    "Branding-focused hackathons",
    "One-time webinars",
    "Expert-only summits",
    "Generic podcasts",
    "No follow-up",
    "No skill tracking"
  ]

  const innoTechCulture = [
    "Learn, build, prove, grow",
    "Certificate based on outcome",
    "Student-growth-focused hackathons",
    "Series-based workshops",
    "Student-first summits",
    "Interviews with achievers & winners",
    "Post-event guidance",
    "Skill and growth analytics"
  ]

  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-6 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> WHY WE STARTED
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 text-center">
        Born from the <span className="text-[#c84c30] italic font-serif">student perspective</span>
      </h2>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-3xl text-center leading-relaxed font-sans mb-16">
        Hackathons for branding. Webinars without depth. Summits for professionals only. Podcasts that ignored student innovators. We're rewriting the rulebook.
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        
        {/* Normal Event Culture Card */}
        <div className="bg-[#FCF5F3] dark:bg-red-950/20 border border-[#EAC2BA] dark:border-red-900/30 rounded-[2rem] p-8 md:p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <X className="w-5 h-5 text-[#c84c30] stroke-[3]" />
            <h3 className="text-lg font-bold text-cozy-dark dark:text-cozy-light tracking-wide uppercase font-sans">
              Normal Event Culture
            </h3>
          </div>
          <ul className="space-y-5">
            {normalEvents.map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-gray-500 dark:text-gray-400 text-sm md:text-base font-sans">
                <X className="w-4 h-4 text-[#c84c30]/60 mt-0.5 md:mt-1 shrink-0 stroke-[2.5]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* InnoTech-Hub Culture Card */}
        <div className="bg-gradient-to-br from-[#FAF7F2] to-[#FDF4EB] dark:from-black/60 dark:to-orange-950/20 border border-[#F2D7C4] dark:border-orange-900/30 shadow-[0_8px_30px_rgb(200,76,48,0.06)] dark:shadow-[0_8px_30px_rgb(200,76,48,0.02)] rounded-[2rem] p-8 md:p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <Check className="w-5 h-5 text-[#c84c30] stroke-[3]" />
            <h3 className="text-lg font-bold italic text-[#c84c30] tracking-wide uppercase font-sans">
              InnoTech-Hub Culture
            </h3>
          </div>
          <ul className="space-y-5">
            {innoTechCulture.map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-cozy-dark/80 dark:text-cozy-light/80 text-sm md:text-base font-sans">
                <Check className="w-4 h-4 text-[#c84c30]/80 mt-0.5 md:mt-1 shrink-0 stroke-[2.5]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
