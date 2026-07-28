import React from 'react'
import ScrollRevealText from '../components/ScrollRevealText'
import { 
  LogIn, 
  UserPlus, 
  Search, 
  Trophy, 
  Wrench, 
  Mic, 
  Video, 
  Brain, 
  Crown, 
  Podcast, 
  PartyPopper 
} from 'lucide-react'

export default function OfficialEventPlatformSection() {
  const eventTypes = [
    {
      icon: Trophy,
      title: "Hackathons",
      desc: "Build. Ship. Win."
    },
    {
      icon: Wrench,
      title: "Workshops",
      desc: "Learn by Doing."
    },
    {
      icon: Mic,
      title: "Seminars",
      desc: "Insights & Ideas."
    },
    {
      icon: Video,
      title: "Webinars",
      desc: "Learn Anywhere."
    },
    {
      icon: Brain,
      title: "AI Conferences",
      desc: "The Future is Now."
    },
    {
      icon: Crown,
      title: "Summits",
      desc: "Leaders Convene."
    },
    {
      icon: Podcast,
      title: "Tech Podcasts",
      desc: "Voices of Tech."
    },
    {
      icon: PartyPopper,
      title: "Tech Carnivals",
      desc: "Celebrate Innovation."
    }
  ]

  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-6 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> OFFICIAL EVENT PLATFORM
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 text-center max-w-2xl leading-tight">
        InnoTech-Hub <span className="text-[#c84c30] italic font-serif">Official</span> Event Platform
      </h2>

      <div className="max-w-3xl text-center mb-10">
        <ScrollRevealText
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={2}
          blurStrength={5}
          textClassName="!text-sm md:!text-base !text-gray-600 dark:!text-gray-300 !leading-relaxed !font-sans !font-normal"
        >
          Created and managed only by the InnoTech-Hub team. Not an open SaaS for external colleges to host events — we run our own official events end-to-end.
        </ScrollRevealText>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#c84c30] hover:bg-[#b04027] text-white font-sans text-sm font-semibold transition-colors shadow-sm">
          <LogIn className="w-4 h-4" />
          Login to Event Platform
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-cozy-dark dark:text-cozy-light font-sans text-sm font-semibold transition-all shadow-sm hover:shadow">
          <UserPlus className="w-4 h-4 text-gray-500" />
          Create Student Account
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-cozy-dark dark:text-cozy-light font-sans text-sm font-semibold transition-all shadow-sm hover:shadow">
          <Search className="w-4 h-4 text-gray-500" />
          Explore Events
        </button>
      </div>

      {/* Mini Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {eventTypes.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="bg-white dark:bg-black/40 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col items-start hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer shadow-sm">
              <Icon className="w-5 h-5 text-[#c84c30] mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-cozy-dark dark:text-cozy-light font-sans mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-sans">
                {item.desc}
              </p>
            </div>
          )
        })}
      </div>

    </div>
  )
}
