import React from 'react'

export default function PixelFooter() {
  return (
    <div className="w-full relative flex flex-col pt-48 min-h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, #db6b3a 20%, #895782 60%, #252549 100%)' }}>
      
      {/* Pixel Stars Background */}
      <div className="absolute top-20 left-[15%] w-2 h-2 bg-yellow-300 opacity-80"></div>
      <div className="absolute top-40 left-[80%] w-2 h-2 bg-yellow-300 opacity-60"></div>
      <div className="absolute top-60 left-[30%] w-1 h-1 bg-white opacity-80"></div>
      <div className="absolute top-32 right-[25%] w-1.5 h-1.5 bg-white opacity-50"></div>
      <div className="absolute top-80 left-[10%] w-2 h-2 bg-yellow-400 opacity-70"></div>

      {/* Spacer to push scenery to bottom if needed, or remove if footer is just the bottom part */}
      <div className="flex-grow"></div>

      {/* Scenery (Pixel Houses) */}
      <div className="absolute bottom-0 w-full h-32 pointer-events-none flex items-end justify-around px-10 pb-4">
        {/* House 1 */}
        <div className="flex flex-col items-center">
          <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[25px] border-b-[#472c1e]"></div>
          <div className="w-16 h-16 bg-[#d97c31] border-4 border-black flex items-center justify-center">
            <div className="w-6 h-6 bg-[#f4d169] border-2 border-black"></div>
          </div>
        </div>

        {/* House 2 */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[35px] border-b-[#472c1e]"></div>
          <div className="w-20 h-20 bg-[#d8a149] border-4 border-black flex items-center justify-center">
            <div className="w-8 h-8 bg-[#f4d169] border-2 border-black"></div>
          </div>
        </div>

        {/* House 3 */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[20px] border-b-[#472c1e]"></div>
          <div className="w-14 h-14 bg-[#6f9ec6] border-4 border-black flex items-center justify-center">
            <div className="w-5 h-5 bg-[#f4d169] border-2 border-black"></div>
          </div>
        </div>

        {/* House 4 */}
        <div className="flex flex-col items-center mb-10 hidden md:flex">
          <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[30px] border-b-[#472c1e]"></div>
          <div className="w-[70px] h-[70px] bg-[#97afd4] border-4 border-black flex items-center justify-center">
            <div className="w-7 h-7 bg-[#f4d169] border-2 border-black"></div>
          </div>
        </div>

        {/* House 5 */}
        <div className="flex flex-col items-center hidden lg:flex">
          <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[35px] border-b-[#472c1e]"></div>
          <div className="w-20 h-20 bg-[#5d8b5a] border-4 border-black flex items-center justify-center">
            <div className="w-8 h-8 bg-[#f4d169] border-2 border-black opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Solid Ground & Actual Footer */}
      <div className="w-full bg-[#111111] border-t-8 border-black pt-16 pb-12 px-8 md:px-16 z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 text-white">
          
          {/* Logo & Info */}
          <div className="flex flex-col max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 overflow-hidden rounded-md border border-white/20 flex items-center justify-center bg-[#0d213b]">
                <img src="/ith-logo.jpg" alt="InnoTech Hub Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="font-pixel text-sm">InnoTech-Hub</span>
            </div>
            <p className="font-mono text-xs text-gray-400 leading-loose">
              Where Innovation Meets Community. Events bring students in. AI tools help them grow. SaaS products help institutions operate smarter.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="font-pixel text-[10px] text-gray-400 uppercase tracking-widest mb-2">Explore</h4>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Events</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">SaaS Products</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Roadmap</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Team</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-pixel text-[10px] text-gray-400 uppercase tracking-widest mb-2">Connect</h4>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Partners</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Contact</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Terms</a>
              <a href="#" className="font-mono text-xs text-gray-300 hover:text-white transition-colors">Rules</a>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-gray-500">© 2026 InnoTech-Hub. All rights reserved.</p>
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Where Innovation Meets Community</p>
        </div>
      </div>

    </div>
  )
}
