import React from 'react'
import { Link } from 'react-router-dom'

export default function MinimalFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-black dark:bg-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section with Logo */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/ith-logo.jpg" 
                alt="InnoTech-Hub Logo" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="font-serif font-bold text-lg">InnoTech-Hub</span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Where Innovation Meets Community. Events bring students in. AI tools help them grow. SaaS products help institutions operate smarter.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-[#c84c30] transition">About</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-[#c84c30] transition">Events</Link></li>
              <li><Link to="/saas" className="text-gray-400 hover:text-[#c84c30] transition">SaaS Products</Link></li>
              <li><Link to="/roadmap" className="text-gray-400 hover:text-[#c84c30] transition">Roadmap</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/partners" className="text-gray-400 hover:text-[#c84c30] transition">Partners</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#c84c30] transition">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-[#c84c30] transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-[#c84c30] transition">Terms</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-400 hover:text-[#c84c30] transition">Cookies</Link></li>
              <li><Link to="/accessibility" className="text-gray-400 hover:text-[#c84c30] transition">Accessibility</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs md:text-sm">
            © {currentYear} InnoTech-Hub. All rights reserved.
          </p>
          
          <p className="text-gray-500 text-xs md:text-sm font-mono tracking-widest">
            WHERE INNOVATION MEETS COMMUNITY
          </p>
        </div>

      </div>
    </footer>
  )
}
