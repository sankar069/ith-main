import React from 'react'
import { Video, Podcast, Check } from 'lucide-react'
import ScrollRevealText from '../components/ScrollRevealText'

export default function ExpertSessionsSection() {
  const sessionCol1 = [
    "Free and paid sessions",
    "Session registration",
    "Q&A",
    "Attendance tracking",
    "Outcome certificates"
  ]

  const sessionCol2 = [
    "Speaker profile",
    "Meeting link sharing",
    "Task-based learning",
    "Feedback collection",
    "Future recording library"
  ]

  const podcastGuests = [
    "Hackathon Winners",
    "Coding Champions",
    "Open Source Devs",
    "Student Innovators",
    "AI Engineers",
    "Project Builders"
  ]

  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-10 pb-10 px-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        
        {/* Card 1: Live Expert Sessions */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-[#f0e6e3] dark:border-gray-800 rounded-3xl p-8 md:p-10 flex-1 shadow-sm hover:shadow-lg transition-all duration-300">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest border border-red-100 dark:border-red-900/20">
            <Video className="w-3.5 h-3.5" /> LIVE EXPERT SESSIONS
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-cozy-dark dark:text-cozy-light mb-4 tracking-tight">
            Short, Powerful, <span className="text-[#c84c30] italic">30-45 min</span>
          </h3>
          
          <ScrollRevealText
            baseOpacity={0.05}
            enableBlur={true}
            baseRotation={2}
            blurStrength={5}
            containerClassName="mb-8"
            textClassName="!text-sm !text-gray-500 dark:!text-gray-400 !font-sans !leading-relaxed !font-normal"
          >
            Expert-led by professionals, founders, developers, designers, recruiters, AI engineers, and achievers. Practical outcomes over long theoretical webinars.
          </ScrollRevealText>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-2">
            <div className="space-y-3">
              {sessionCol1.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c84c30] shrink-0 stroke-[2.5]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-sans">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 mt-3 sm:mt-0">
              {sessionCol2.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c84c30] shrink-0 stroke-[2.5]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-sans">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Card 2: Tech Podcast */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-[#f0e6e3] dark:border-gray-800 rounded-3xl p-8 md:p-10 flex-1 shadow-sm hover:shadow-lg transition-all duration-300">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest border border-red-100 dark:border-red-900/20">
            <Podcast className="w-3.5 h-3.5" /> TECH PODCAST
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-cozy-dark dark:text-cozy-light mb-4 tracking-tight">
            Voices of Real <span className="text-[#c84c30] italic">Tech Achievers</span>
          </h3>
          
          <ScrollRevealText
            baseOpacity={0.05}
            enableBlur={true}
            baseRotation={2}
            blurStrength={5}
            containerClassName="mb-8"
            textClassName="!text-sm !text-gray-500 dark:!text-gray-400 !font-sans !leading-relaxed !font-normal"
          >
            Interviews with national-level hackathon winners, coding champions, student innovators, and open-source contributors — so budding students learn from real journeys.
          </ScrollRevealText>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
            {podcastGuests.map((item, i) => (
              <div 
                key={i} 
                className="border border-[#ebdcd8] dark:border-red-900/30 bg-white/50 dark:bg-black/40 rounded-xl px-4 py-3.5 text-xs md:text-sm text-gray-600 dark:text-gray-300 font-sans hover:bg-white dark:hover:bg-red-950/20 hover:border-[#c84c30]/30 transition-all cursor-default shadow-sm hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                {item}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  )
}
