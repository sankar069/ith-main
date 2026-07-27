import React, { useState } from 'react'
import { Users } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

function TeamCard({ team, delay }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <ScrollReveal delay={delay}>
      <div 
        className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col group cursor-pointer"
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-[#c84c30] flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
          <Users className="w-5 h-5 text-white stroke-[1.8]" />
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3">
          {team.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed mb-6 flex-1">
          {team.desc}
        </p>

        {/* Status (visible when collapsed) */}
        <div className={`transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <span className="text-[10px] font-bold text-[#c84c30] uppercase tracking-widest">
            {team.status}
          </span>
        </div>

        {/* Expandable Dropdown Content */}
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
        >
          {/* Divider */}
          <div className="w-full h-px bg-[#f0e6e3] dark:bg-gray-800 mb-5"></div>

          {/* Role Highlights Pill */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-700 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            ROLE HIGHLIGHTS
          </div>

          {/* Expanded Description */}
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed mb-5">
            {team.expandedDesc}
          </p>

          {/* Close Button */}
          <div className="flex justify-end">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-[#c84c30] transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function TeamSection() {
  const teams = [
    {
      title: "Founders / Core Team",
      desc: "Spearheads the strategic vision, identifies expansion opportunities, and manages high-level partnerships and investor relations for the InnoTech-Hub ecosystem.",
      status: "COMING SOON",
      expandedDesc: "Join our founders / core team to shape the future of InnoTech-Hub. Detailed roles and application links will be available soon."
    },
    {
      title: "Event Operations Team",
      desc: "Oversees the end-to-end execution of hackathons and conferences, managing on-ground logistics, hospitality, and participant support systems.",
      status: "COMING SOON",
      expandedDesc: "Join our event operations team to help deliver world-class hackathons and conferences. Detailed roles and application links will be available soon."
    },
    {
      title: "Tech / Product Team",
      desc: "Architects and maintains the core platform, developing AI-driven student tools and institution-facing SaaS products with a focus on performance and scale.",
      status: "COMING SOON",
      expandedDesc: "Join our tech / product team to build cutting-edge AI tools and scalable SaaS platforms. Detailed roles and application links will be available soon."
    },
    {
      title: "Design & Media Team",
      desc: "Crafts the brand's visual identity, producing high-impact graphics, promotional videos, and creative campaigns for events and outreach.",
      status: "COMING SOON",
      expandedDesc: "Join our design & media team to create stunning visuals and campaigns that inspire. Detailed roles and application links will be available soon."
    },
    {
      title: "Community Team",
      desc: "Drives student engagement through campus ambassador programs, managing online communities and fostering collaborative environments across regional hubs.",
      status: "COMING SOON",
      expandedDesc: "Join our community team to connect students and build thriving campus networks. Detailed roles and application links will be available soon."
    },
    {
      title: "Partnerships Team",
      desc: "Nurtures relationships with industry leaders, academic institutions, and sponsors to build a sustainable network of tech-driven opportunities.",
      status: "COMING SOON",
      expandedDesc: "Join our partnerships team to forge strategic alliances with industry and academia. Detailed roles and application links will be available soon."
    }
  ]

  return (
    <ScrollReveal className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> THE TEAM
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-2 text-center leading-tight">
        Meet the Minds Behind the
      </h2>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-[#c84c30] italic font-serif mb-6 text-center leading-tight">
        Movement
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-14 max-w-3xl leading-relaxed">
        A student-led, innovation-driven team building real solutions from real campus problems.
      </p>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl">
        {teams.map((team, i) => (
          <TeamCard key={i} team={team} delay={i * 120} />
        ))}
      </div>
    </ScrollReveal>
  )
}
