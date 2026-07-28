import React from 'react'
import { Server, Shield, Database, Cpu } from 'lucide-react'

export default function SaaSProducts() {
  const products = [
    {
      name: "InnoCloud Hosting",
      icon: <Server className="w-6 h-6" />,
      desc: "Fast, reliable student project hosting.",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      name: "AuthGuard SDK",
      icon: <Shield className="w-6 h-6" />,
      desc: "Drop-in authentication for your hacks.",
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
    },
    {
      name: "DataLake DB",
      icon: <Database className="w-6 h-6" />,
      desc: "Instant serverless databases for prototypes.",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
    },
    {
      name: "AI Copilot API",
      icon: <Cpu className="w-6 h-6" />,
      desc: "Integrate LLMs with a single API call.",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"
    }
  ]

  return (
    <div className="flex flex-col space-y-6 px-2 py-4">
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-cozy-dark dark:text-cozy-light">
          SaaS Suite
        </h2>
        <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
          Tools built to supercharge your hackathon projects.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p, idx) => (
          <div 
            key={idx} 
            className="group flex flex-col p-4 bg-white dark:bg-cozy-dark border-4 border-cozy-dark dark:border-cozy-light rounded-xl hover:-translate-y-1 transition-transform cursor-pointer shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_#f0f0f0]"
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 border-black dark:border-white mb-3 ${p.color}`}>
              {p.icon}
            </div>
            <h3 className="font-bold text-lg text-cozy-dark dark:text-cozy-light font-display">
              {p.name}
            </h3>
            <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
