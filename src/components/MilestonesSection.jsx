import React from 'react'
import ScrollReveal from '../components/ScrollReveal'

export default function MilestonesSection() {
  const milestones = [
    { quarter: "Q2 2026", title: "Event Platform v2.0 Launch", status: "COMPLETED", statusColor: "bg-[#c84c30]" },
    { quarter: "Q3 2026", title: "Task Manager SaaS Beta", status: "IN PROGRESS", statusColor: "bg-[#d4894e]" },
    { quarter: "Q3 2026", title: "Volunteer Tracking Pilot", status: "IN PROGRESS", statusColor: "bg-[#d4894e]" },
    { quarter: "Q4 2026", title: "Repository System MVP", status: "UPCOMING", statusColor: "bg-gray-400" },
    { quarter: "Q4 2026", title: "Faculty Alerts Prototype", status: "UPCOMING", statusColor: "bg-gray-400" },
    { quarter: "Q1 2027", title: "Full Ecosystem Beta", status: "UPCOMING", statusColor: "bg-gray-400" }
  ]

  return (
    <ScrollReveal className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> KEY MILESTONES
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center leading-tight">
        Key <span className="text-[#c84c30] italic font-serif">Milestones</span>
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-14 max-w-2xl leading-relaxed">
        Important launches and releases on our roadmap
      </p>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl">
        {milestones.map((m, i) => (
          <ScrollReveal key={i} delay={i * 120}>
            <div className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              {/* Red dot + Quarter */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#c84c30] shrink-0"></span>
                <span className="text-xs font-bold text-[#c84c30] uppercase tracking-widest font-sans">
                  {m.quarter}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base md:text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-4 leading-snug">
                {m.title}
              </h3>

              {/* Status Badge */}
              <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest text-white ${m.statusColor}`}>
                {m.status}
              </span>

              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#c84c30]/10 transition-colors duration-300 pointer-events-none"></div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </ScrollReveal>
  )
}
