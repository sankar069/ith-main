import React from 'react'
import CountUpPkg from 'react-countup'
import { Activity, Rocket, Trophy } from 'lucide-react'

const CountUp = CountUpPkg.default || CountUpPkg;

export default function TractionTelemetry() {
  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0">
      {/* Outer Container */}
      <div className="bg-[#FAF7F2] dark:bg-black/60 border border-cozy-dark/10 dark:border-cozy-light/10 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative w-full max-w-7xl min-w-0">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 font-mono">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-[#c84c30] text-sm">◴</span> LIVE TRACTION TELEMETRY
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> SYSTEM ONLINE
          </div>
        </div>

        {/* Wrapping Data Container - No Scrolling */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 md:gap-6 py-6 w-full">

          {/* Card 1 */}
          <div className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-1rem)] lg:w-auto lg:flex-1 bg-transparent border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 flex flex-col justify-center relative bg-white/40 dark:bg-black/20 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="absolute -top-3 -left-2 md:-left-4 bg-white dark:bg-cozy-dark border border-cozy-dark/10 dark:border-cozy-light/10 rounded-full px-2 py-0.5 flex items-center gap-1.5 text-[10px] shadow-sm text-cozy-dark dark:text-cozy-light font-mono font-bold animate-bobbing z-10">
              <Activity className="w-3 h-3 text-[#5D8B7A]" /> +24% growth
            </div>
            <div className="text-3xl xl:text-4xl font-serif italic text-[#c84c30] font-bold leading-tight">
              ₹<CountUp end={2.4} decimals={1} duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} /><br/>Lakhs<span className="text-2xl xl:text-3xl">+</span>
            </div>
            <div className="text-[9px] xl:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-4 font-semibold font-mono">
              REVENUE GENERATED
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-1rem)] lg:w-auto lg:flex-1 bg-transparent border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 flex flex-col justify-center bg-white/40 dark:bg-black/20 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="text-3xl xl:text-4xl font-serif italic text-[#c84c30] font-bold">
              <CountUp end={7} duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} /><span className="text-2xl xl:text-3xl">+</span>
            </div>
            <div className="text-[9px] xl:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-4 font-semibold font-mono leading-relaxed">
              EVENTS<br/>CONDUCTED
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-1rem)] lg:w-auto lg:flex-1 bg-transparent border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 flex flex-col justify-center bg-white/40 dark:bg-black/20 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="text-3xl xl:text-4xl font-serif italic text-[#c84c30] font-bold">
              <CountUp end={1} duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} />
            </div>
            <div className="text-[9px] xl:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-4 font-semibold font-mono leading-relaxed">
              HACKATHON <br/>COLLABORATION
            </div>
          </div>

          {/* Card 4 */}
          <div className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-1rem)] lg:w-auto lg:flex-1 bg-transparent border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 flex flex-col justify-center bg-white/40 dark:bg-black/20 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="text-3xl xl:text-4xl font-serif italic text-[#c84c30] font-bold flex items-baseline">
              <CountUp end={3000} separator="," duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} /><span className="text-2xl xl:text-3xl">+</span>
            </div>
            <div className="text-[9px] xl:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-4 font-semibold font-mono leading-relaxed">
              PARTICIPANTS<br/>REACHED
            </div>
          </div>

          {/* Card 5 */}
          <div className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-1rem)] lg:w-auto lg:flex-1 bg-transparent border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 flex flex-col justify-center bg-white/40 dark:bg-black/20 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="text-3xl xl:text-4xl font-serif italic text-[#c84c30] font-bold flex items-baseline">
              <CountUp end={8} duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} /><span className="text-2xl xl:text-3xl">+</span>
            </div>
            <div className="text-[9px] xl:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-4 font-semibold font-mono leading-relaxed">
              STATES<br/>REPRESENTED
            </div>
          </div>

          {/* Card 6 */}
          <div className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-1rem)] lg:w-auto lg:flex-1 bg-transparent border border-cozy-dark/10 dark:border-cozy-light/10 rounded-2xl p-6 flex flex-col justify-center relative bg-white/40 dark:bg-black/20 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer group">
             <div className="absolute -top-3 -right-2 md:-right-4 bg-white dark:bg-cozy-dark border border-cozy-dark/10 dark:border-cozy-light/10 rounded-full px-2 py-0.5 flex items-center gap-1.5 text-[10px] shadow-sm text-cozy-dark dark:text-cozy-light font-mono font-bold z-10 whitespace-nowrap animate-bobbing" style={{ animationDelay: '0.5s' }}>
              <Rocket className="w-3 h-3 text-[#c84c30]" /> SaaS shipping
            </div>
            <div className="absolute top-[40%] -right-4 md:-right-8 bg-white dark:bg-cozy-dark border border-cozy-dark/10 dark:border-cozy-light/10 rounded-full px-2 py-1 flex items-center gap-1.5 text-[8px] xl:text-[10px] shadow-sm text-cozy-dark dark:text-cozy-light font-mono font-bold whitespace-nowrap z-20 animate-bobbing" style={{ animationDelay: '1.5s' }}>
              <Trophy className="w-3.5 h-3.5 text-[#c84c30]" /> 1 hackathon with Gemini Google
            </div>
            <div className="text-3xl xl:text-4xl font-serif italic text-[#c84c30] font-bold">
              <CountUp end={25} duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} /><span className="text-2xl xl:text-3xl">+</span>
            </div>
            <div className="text-[9px] xl:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-4 font-semibold font-mono leading-relaxed">
              COLLEGES<br/>CONNECTED
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
