import React, { useEffect, useState, useRef } from 'react'
import { Briefcase, Activity } from 'lucide-react'
import ScrollRevealText from '../components/ScrollRevealText'

const CountUp = ({ end, prefix = "", suffix = "", isVisible, duration = 2000 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // easeOutQuart easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(end * easeOutQuart)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    window.requestAnimationFrame(step)
  }, [isVisible, end, duration])

  const isDecimal = end % 1 !== 0
  const formattedCount = isDecimal 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString()

  return <>{prefix}{formattedCount}{suffix}</>
}

export default function BusinessModelSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  const revenuePills = [
    "Paid events", "Paid workshops", "Live expert sessions", "Sponsorships",
    "Partner collaborations", "Premium AI tools", "SaaS subscriptions", "College repository plans",
    "Volunteer tracking plans", "Task manager plans", "Faculty alert plans"
  ]

  const tractionStats = [
    { prefix: "₹", end: 2.4, suffix: " Lakhs+", label: "REVENUE GENERATED" },
    { prefix: "", end: 7, suffix: "+", label: "TECH & NON-TECH EVENTS" },
    { prefix: "", end: 1, suffix: "", label: "HACKATHON WITH GEMINI GOOGLE" },
    { prefix: "", end: 3000, suffix: "+", label: "PARTICIPANTS REACHED" },
    { prefix: "", end: 8, suffix: "+", label: "STATES REPRESENTED" },
    { prefix: "", end: 25, suffix: "+", label: "COLLEGES CONNECTED" }
  ]

  return (
    <div ref={sectionRef} className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col lg:flex-row items-center lg:items-center justify-between pt-20 pb-10 px-4 gap-12 lg:gap-8">
      
      {/* Left Column: Business Model */}
      <div className="flex-1 w-full flex flex-col items-start max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
          <Briefcase className="w-3.5 h-3.5" /> BUSINESS MODEL
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 leading-tight">
          Revenue Built on <span className="text-[#c84c30] italic font-serif">Real Value</span>
        </h2>
        
        <ScrollRevealText
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={2}
          blurStrength={5}
          containerClassName="mb-8"
          textClassName="!text-sm md:!text-base !text-gray-500 dark:!text-gray-400 !font-sans !leading-relaxed !font-normal"
        >
          Already generated ₹2.4 Lakhs+ revenue, fully reinvested into events, hackathons, and product. Our promise: keep student platform fees ultra-low — and zero where possible.
        </ScrollRevealText>

        <div className="flex flex-wrap gap-2.5">
          {revenuePills.map((pill, i) => (
            <div 
              key={i} 
              className={`px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/40 text-xs text-gray-500 dark:text-gray-400 font-sans shadow-sm transition-all duration-700 hover:-translate-y-0.5 hover:shadow-md hover:border-[#c84c30]/30 cursor-default
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Traction Dashboard */}
      <div className={`flex-1 w-full max-w-2xl bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-1000 transform hover:shadow-md ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#c84c30]" />
            <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-cozy-light tracking-wide">
              Current Traction
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#10b981] uppercase bg-[#10b981]/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span> LIVE
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tractionStats.map((stat, i) => (
            <div 
              key={i} 
              className={`bg-white dark:bg-black/60 border border-[#f0e6e3] dark:border-gray-800 rounded-2xl p-5 md:p-6 flex flex-col justify-center transition-all duration-700 hover:shadow-sm hover:-translate-y-1 hover:border-[#c84c30]/20
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
              `}
              style={{ transitionDelay: `${400 + i * 100}ms` }}
            >
              <h4 className="text-3xl md:text-4xl font-serif italic font-bold text-[#c84c30] mb-2 tracking-tight drop-shadow-sm flex items-center">
                <CountUp 
                  end={stat.end} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  isVisible={isVisible} 
                  duration={2000 + (i * 200)} 
                />
              </h4>
              <p className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 font-sans uppercase tracking-widest font-bold leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
