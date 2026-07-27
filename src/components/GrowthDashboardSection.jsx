import React, { useEffect, useState, useRef } from 'react'
import { BarChart2, TrendingUp } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function GrowthDashboardSection() {
  const { openModal } = useAppStore()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  const profileModules = [
    "Registered Events",
    "Attended Events",
    "Certificates Earned",
    "Projects Submitted",
    "Hackathons Participated",
    "Skills Gained",
    "Team History",
    "AI Tool Usage",
    "Resume Readiness",
    "Growth Percentage"
  ]

  const growthAnalytics = [
    { label: "Event Participation", value: 75 },
    { label: "Practical Submission", value: 60 },
    { label: "Team Collaboration", value: 80 },
    { label: "Certificate Completion", value: 90 },
    { label: "Career Readiness", value: 70 }
  ]

  return (
    <div ref={sectionRef} className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-6 font-mono hover:scale-105 transition-transform cursor-default">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> INNOVATION PASSPORT
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center max-w-2xl leading-tight">
        Student <span className="text-[#c84c30] italic font-serif">Growth</span> Dashboard
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-12 max-w-2xl">
        Every student gets a personal dashboard — events become growth insights, not just history.
      </p>

      {/* Two Cards Container */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mb-12">
        
        {/* Card 1: Profile Modules */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-[#f0e6e3] dark:border-red-900/20 rounded-3xl p-8 flex-1 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-[#c84c30] stroke-[2.5]" />
              <h3 className="font-serif font-bold text-lg text-cozy-dark dark:text-cozy-light tracking-wide">
                My Profile Modules
              </h3>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              10 Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profileModules.map((mod, i) => (
              <div 
                key={i} 
                className="border border-[#ebdcd8] dark:border-red-900/30 bg-white/50 dark:bg-black/40 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-600 dark:text-gray-300 font-sans hover:bg-white dark:hover:bg-red-950/20 hover:border-[#c84c30]/30 transition-all cursor-default shadow-sm hover:scale-[1.02] hover:-translate-y-0.5"
              >
                {mod}
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Growth Analytics */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-[#f0e6e3] dark:border-red-900/20 rounded-3xl p-8 flex-1 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#c84c30] stroke-[2.5]" />
              <h3 className="font-serif font-bold text-lg text-cozy-dark dark:text-cozy-light tracking-wide">
                Growth Analytics
              </h3>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Live
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {growthAnalytics.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-end text-xs md:text-sm font-sans text-gray-500 dark:text-gray-400">
                  <span>{stat.label}</span>
                  <span className="font-bold text-cozy-dark dark:text-cozy-light font-mono">
                    {isVisible ? stat.value : 0}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f0e8e5] dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#c84c30] rounded-full transition-all duration-[1500ms] ease-out" 
                    style={{ width: isVisible ? `${stat.value}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Text */}
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center font-sans mb-8 max-w-2xl px-4 leading-relaxed">
        Your profile becomes a <span className="font-bold text-cozy-dark dark:text-cozy-light">digital innovation passport</span> — achievements, certificates, skills, and event history connected in one place.
      </p>

      {/* Button */}
      <button 
        onClick={() => openModal('dashboard')}
        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#c84c30] hover:bg-[#b04027] text-white font-sans text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
      >
        <BarChart2 className="w-4 h-4" />
        Open My Dashboard
      </button>

    </div>
  )
}
