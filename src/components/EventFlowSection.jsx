import React from 'react'
import { Search } from 'lucide-react'

export default function EventFlowSection() {
  const steps = [
    "DISCOVER EVENT",
    "AI RECOMMENDATION",
    "REGISTER",
    "PAYMENT / TICKETING",
    "ATTEND",
    "SUBMIT PROJECT",
    "CERTIFICATE GENERATED",
    "PROFILE UPDATED",
    "NEXT EVENT RECOMMENDED"
  ]

  const capabilities = [
    ["Event discovery", "Project submission", "Skill growth dashboard"],
    ["Student registration", "Attendance tracking", "AI recommendations"],
    ["Payment & ticketing", "Verified certificates", "AI idea generator"],
    ["QR / manual payment", "Sponsor visibility", "Resume analyzer"]
  ]

  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center">
        Event Flow — <span className="font-serif">The Racing Track</span>
      </h2>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-16">
        Every student journey from start grid to podium.
      </p>

      {/* Horizontal Timeline */}
      <div className="w-full max-w-6xl overflow-x-auto pb-8 custom-scrollbar">
        <div className="flex items-start justify-between relative min-w-[800px] px-4">
          
          {/* Connecting Line */}
          <div className="absolute left-10 right-10 top-6 h-[2px] bg-[#EAC2BA] dark:bg-red-900/30 -z-10"></div>
          
          {/* Step Circles */}
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-20 md:w-24 group">
              <div className="w-12 h-12 rounded-full bg-[#c84c30] text-white flex items-center justify-center font-bold text-sm shadow-sm mb-4 group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
              <span className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase text-center leading-tight tracking-wider px-1">
                {step}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* Platform Capabilities Card */}
      <div className="w-full max-w-5xl bg-[#FCFDFD] dark:bg-black/60 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-sm mt-12 transition-all hover:shadow-md">
        
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-8">
          <Search className="w-5 h-5 text-[#c84c30] stroke-[2.5]" />
          <h3 className="text-xl font-serif font-bold text-cozy-dark dark:text-cozy-light">
            Platform Capabilities
          </h3>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {capabilities.map((col, colIndex) => (
            <ul key={colIndex} className="space-y-4">
              {col.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-sans group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30] opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all"></span>
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>

      </div>

    </div>
  )
}
