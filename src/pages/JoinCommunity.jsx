import React from 'react'
import { Disc as Discord } from 'lucide-react'

export default function JoinCommunity() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 space-y-6">
      <div className="w-24 h-24 bg-[#5865F2] rounded-2xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_#000]">
        <Discord className="w-12 h-12 text-white" />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-cozy-dark dark:text-cozy-light">
          Join our Server
        </h2>
        <p className="font-mono text-sm text-gray-600 dark:text-gray-300 max-w-sm">
          Connect with other builders, find a team, and stay updated on the latest events!
        </p>
      </div>

      <a 
        href="https://discord.gg/CMegRgSgM" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono font-bold rounded-xl border-4 border-black active:scale-95 transition-transform"
      >
        Join our community
      </a>
    </div>
  )
}
