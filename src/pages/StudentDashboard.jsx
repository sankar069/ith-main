import React from 'react'

export default function StudentDashboard() {
  const skills = ['React', 'Tailwind', 'AI Integrations', 'UI/UX Design']
  
  return (
    <div className="font-mono space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')] border-2 border-cozy-dark/20 rounded-xl relative overflow-hidden">
        <div className="w-24 h-24 rounded-full bg-cozy-primary border-4 border-white drop-shadow-flat flex-shrink-0 flex items-center justify-center">
          <span className="text-4xl">😎</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display">Shar's Journal</h2>
          <p className="text-sm opacity-80 mt-1">Level 12 Innovator • 4 Events Attended</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scrapbook Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b-2 border-dashed border-cozy-dark/30 pb-2">Certificates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-2 pb-6 border shadow-sm rotate-[-2deg] hover:rotate-0 hover:scale-105 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="w-full h-24 bg-cozy-accent/30 flex items-center justify-center text-2xl">🏆</div>
              <p className="text-xs text-center font-bold mt-2 font-display text-cozy-dark">Web3 Summit</p>
            </div>
            <div className="bg-white p-2 pb-6 border shadow-sm rotate-[3deg] hover:rotate-0 hover:scale-105 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="w-full h-24 bg-green-400/30 flex items-center justify-center text-2xl">🏅</div>
              <p className="text-xs text-center font-bold mt-2 font-display text-cozy-dark">Hack 2025</p>
            </div>
          </div>
        </div>

        {/* Skills Board */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b-2 border-dashed border-cozy-dark/30 pb-2">Skills Gained</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 rounded-md text-sm shadow-sm hover:-translate-y-1 hover:scale-110 cursor-pointer transition-transform">
                📌 {skill}
              </span>
            ))}
          </div>
          
          <div className="mt-6 p-4 border-2 border-cozy-accent rounded-lg bg-cozy-accent/10 animate-bobbing hover:scale-[1.02] transition-transform cursor-pointer">
            <p className="text-sm font-bold flex items-center gap-2">
              <span className="animate-pulse">🤖</span> AI Resume Analysis
            </p>
            <p className="text-xs mt-2 opacity-80">Your profile looks great! Consider joining a Backend event next to round out your stack.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
