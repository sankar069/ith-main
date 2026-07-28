import React from 'react'
import { Target, Users, Wrench, Sparkles } from 'lucide-react'
import ScrollRevealText from '../components/ScrollRevealText'

export default function AboutSection() {
  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-6 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> ABOUT INNOTECH-HUB
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 text-center">
        Building the <span className="text-[#c84c30] italic font-serif">Future</span>, Together
      </h2>

      {/* Description with ScrollRevealText */}
      <div className="max-w-4xl text-center mb-16">
        <ScrollRevealText
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={2}
          blurStrength={5}
          containerClassName=""
          textClassName="!text-sm md:!text-base !text-gray-600 dark:!text-gray-300 !leading-relaxed !font-sans !font-normal"
        >
          We noticed many events were branding-focused, theoretical, or expensive — and certificates rarely proved real skill. So we built a student-first ecosystem where every event becomes a learning journey, and every certificate becomes proof.
        </ScrollRevealText>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl">
        
        {/* Card 1 */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 md:p-8 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#c84c30] flex items-center justify-center text-white mb-6 shadow-sm">
            <Target className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3">
            Mission-Driven
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
            Empowering students through practical, affordable, outcome-based tech experiences.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 md:p-8 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#c84c30] flex items-center justify-center text-white mb-6 shadow-sm">
            <Users className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3">
            Community-Led
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
            A network of students, developers, designers, innovators, mentors, and young achievers.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 md:p-8 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#c84c30] flex items-center justify-center text-white mb-6 shadow-sm">
            <Wrench className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3">
            Practical Learning
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
            Hackathons, workshops, live sessions, projects, and task-based certificates over theory.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#FAF7F2] dark:bg-black/60 border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 md:p-8 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#c84c30] flex items-center justify-center text-white mb-6 shadow-sm">
            <Sparkles className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3">
            Innovation-Focused
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
            Turning events into measurable growth via AI tools, dashboards, and verified certificates.
          </p>
        </div>

      </div>
    </div>
  )
}
