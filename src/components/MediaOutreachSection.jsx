import React, { useState } from 'react'
import { Video } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

function MediaCard({ item, delay }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <ScrollReveal delay={delay}>
      <div
        className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-[#c84c30]/10 dark:bg-[#c84c30]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Video className="w-5 h-5 text-[#c84c30] stroke-[1.8]" />
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-serif font-bold text-cozy-dark dark:text-cozy-light mb-1">
          {item.title}
        </h3>

        {/* Expandable Dropdown Content */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden w-full ${isExpanded ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          {/* Description */}
          <p className="text-xs text-gray-400 dark:text-gray-500 font-sans leading-relaxed mb-4">
            {item.desc}
          </p>

          {/* Link Coming Soon Button */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-md border border-[#f0e6e3] dark:border-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 cursor-default">
            Link Coming Soon
          </div>

          {/* Close */}
          <div className="flex justify-end mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-[#c84c30] transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function MediaOutreachSection() {
  const mediaItems = [
    {
      title: "Event Highlights",
      desc: "Archive of our latest event highlights and outreach activities."
    },
    {
      title: "Podcast Highlights",
      desc: "Curated clips from our tech podcast interviews with student achievers and industry voices."
    },
    {
      title: "Awards & Recognition",
      desc: "A showcase of milestones, awards, and recognitions earned by InnoTech-Hub and its community."
    },
    {
      title: "Press & Coverage",
      desc: "Media mentions, press releases, and feature articles covering our journey and impact."
    },
    {
      title: "Community Outreach",
      desc: "Initiatives and programs driving student engagement across campuses and regional hubs."
    },
    {
      title: "Gallery & Media",
      desc: "Photos, videos, and creative assets from our events, workshops, and collaborations."
    }
  ]

  return (
    <ScrollReveal className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> OUTREACH
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center leading-tight">
        Media & <span className="text-[#c84c30] italic font-serif">Outreach</span>
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-14 max-w-3xl leading-relaxed">
        Building presence through events, student stories, podcasts, workshops, and collaborations.
      </p>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
        {mediaItems.map((item, i) => (
          <MediaCard key={i} item={item} delay={i * 120} />
        ))}
      </div>
    </ScrollReveal>
  )
}
