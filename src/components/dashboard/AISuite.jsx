import React from 'react'
import { Bot, Compass, Lightbulb, ShieldCheck, Users, FileText } from 'lucide-react'

export default function AISuite() {
  const aiTools = [
    {
      title: 'AI Chat Mentor',
      desc: 'Ongoing career and technical guidance',
      icon: Bot,
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Smart Event Recommender',
      desc: 'Suggests events based on your skills',
      icon: Compass,
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Hackathon Idea Generator',
      desc: 'Tailored ideas for event themes',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      title: 'Idea Analyzer',
      desc: 'Score projects on feasibility',
      icon: ShieldCheck,
      color: 'from-green-400 to-emerald-600',
    },
    {
      title: 'AI Team Matcher',
      desc: 'Find teammates with complementary skills',
      icon: Users,
      color: 'from-pink-400 to-red-500',
    },
    {
      title: 'ATS Resume Analyzer',
      desc: 'Optimize for ATS standards',
      icon: FileText,
      color: 'from-indigo-400 to-indigo-600',
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-cozy-light dark:bg-cozy-dark">{/* Flat background */}
      
      <div>
        <h1 className="text-3xl font-serif font-bold text-cozy-dark dark:text-white mb-2">InnoTech AI Suite</h1>
        <p className="text-gray-600 dark:text-gray-400">AI-powered tools to accelerate your tech journey</p>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiTools.map((tool, idx) => {
          const Icon = tool.icon
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${tool.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-2 transition cursor-pointer group`}
            >
              <Icon className="w-12 h-12 mb-4 opacity-80 group-hover:opacity-100 transition" />
              <h3 className="text-xl font-serif font-bold mb-2">{tool.title}</h3>
              <p className="text-white/90 text-sm mb-4">{tool.desc}</p>
              <button className="w-full px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition">
                Launch Tool
              </button>
            </div>
          )
        })}
      </div>

    </div>
  )
}
