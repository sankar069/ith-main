import React, { useState } from 'react'
import ScrollRevealText from '../components/ScrollRevealText'
import { 
  Bot, 
  Compass, 
  Lightbulb, 
  FileSearch, 
  Users, 
  FileText, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react'

export default function AISuiteSection() {
  const [selectedTool, setSelectedTool] = useState(null)

  const aiTools = [
    {
      icon: Bot,
      title: "AI Chat Assistant",
      desc: "A personal mentor suggesting events, courses, projects, teammates, and career paths."
    },
    {
      icon: Compass,
      title: "AI Event Recommendation",
      desc: "Recommends events based on skills, interests, year, and career goals."
    },
    {
      icon: Lightbulb,
      title: "AI Idea Generator",
      desc: "Hackathon ideas tuned to theme, team skills, time, and tech stack."
    },
    {
      icon: FileSearch,
      title: "AI Idea Analyzer",
      desc: "Checks uniqueness, feasibility, business value, and presentation strength."
    },
    {
      icon: Users,
      title: "AI Team Matching",
      desc: "Matches by skills, interests, availability, domain, and project goals."
    },
    {
      icon: FileText,
      title: "Resume Analyzer",
      desc: "Resume score, missing skills, ATS suggestions, and event-based bullets."
    },
    {
      icon: GraduationCap,
      title: "AI Career Guidance",
      desc: "Personalized career roadmaps, skill gap analysis, and next-step recommendations for your tech journey."
    }
  ]

  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-6 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> AI SUITE
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center max-w-2xl leading-tight">
        AI-Powered <span className="text-[#c84c30] italic font-serif">Student Growth</span> Tools
      </h2>

      <div className="max-w-2xl text-center mb-12">
        <ScrollRevealText
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={2}
          blurStrength={5}
          textClassName="!text-sm md:!text-base !text-gray-500 dark:!text-gray-400 !font-sans !font-normal"
        >
          AI guides students before, during, and after every event.
        </ScrollRevealText>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {aiTools.map((tool, i) => {
          const Icon = tool.icon
          return (
            <div 
              key={i} 
              onClick={() => setSelectedTool(tool)}
              className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 group cursor-pointer"
            >
              {/* Icon Box */}
              <div className="w-10 h-10 rounded-[10px] bg-[#c84c30] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3">
                {tool.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-sans mb-8 leading-relaxed">
                {tool.desc}
              </p>

              {/* Coming Soon Pill */}
              <div className="mt-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 text-[9px] md:text-[10px] font-bold text-[#c84c30] uppercase border border-red-100 dark:border-red-900/30">
                <Sparkles className="w-3 h-3" /> COMING SOON
              </div>
            </div>
          )
        })}
      </div>

      {/* Dynamic Modal Overlay */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Blurred Background */}
          <div 
            className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedTool(null)}
          ></div>
          
          {/* Modal Card */}
          <div className="relative bg-[#FCFDFD] dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-10 flex flex-col items-center max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Icon */}
            <div className="w-12 h-12 rounded-[12px] bg-[#c84c30] flex items-center justify-center text-white mb-6 shadow-md">
              <selectedTool.icon className="w-6 h-6 stroke-[2]" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3 text-center">
              {selectedTool.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 font-sans text-center mb-8 leading-relaxed px-4">
              This feature is currently under development and will be available soon.
            </p>

            {/* Coming Soon Pill */}
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf2f0] dark:bg-red-950/30 text-[10px] font-bold text-[#c84c30] uppercase border border-[#f5d9d4] dark:border-red-900/30 mb-8 tracking-widest">
              COMING SOON
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setSelectedTool(null)}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-sans transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
