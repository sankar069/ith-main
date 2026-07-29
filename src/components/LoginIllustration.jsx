import React from 'react'

export default function LoginIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Soft decorative blobs */}
      <div className="absolute top-12 right-10 w-24 h-24 rounded-full bg-[#c84c30]/8 blur-2xl" />
      <div className="absolute bottom-16 left-8 w-32 h-32 rounded-full bg-[#8ab4f8]/15 blur-2xl" />

      <svg viewBox="0 0 360 420" className="w-full max-w-[300px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Swirl accent */}
        <path
          d="M180 40 C150 60 130 90 140 120 C155 160 200 150 210 120 C220 90 210 55 180 40Z"
          stroke="#c84c30"
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity="0.35"
        />

        {/* Floating event card */}
        <g transform="translate(24, 72)">
          <rect x="0" y="0" width="108" height="72" rx="14" fill="white" stroke="#2d333b" strokeWidth="2" />
          <text x="14" y="24" fill="#2d333b" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">Hackathon</text>
          <text x="14" y="42" fill="#6b7280" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">3 Events</text>
          <circle cx="82" cy="48" r="18" stroke="#c84c30" strokeWidth="3" fill="none" strokeDasharray="85 100" strokeLinecap="round" transform="rotate(-90 82 48)" />
          <text x="82" y="52" textAnchor="middle" fill="#c84c30" fontSize="8" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">72%</text>
          <rect x="14" y="52" width="42" height="14" rx="7" fill="#fdf0ed" />
          <text x="35" y="62" textAnchor="middle" fill="#c84c30" fontSize="7" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">Events</text>
        </g>

        {/* Floating AI card */}
        <g transform="translate(228, 96)">
          <rect x="0" y="0" width="96" height="64" rx="14" fill="white" stroke="#2d333b" strokeWidth="2" />
          <text x="12" y="22" fill="#2d333b" fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">AI Tools</text>
          <text x="12" y="38" fill="#6b7280" fontSize="8" fontFamily="Plus Jakarta Sans, sans-serif">50 Credits</text>
          <rect x="12" y="44" width="36" height="12" rx="6" fill="#eef4fd" />
          <text x="30" y="53" textAnchor="middle" fill="#8ab4f8" fontSize="7" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">Suite</text>
        </g>

        {/* Avatar dots */}
        <circle cx="52" cy="168" r="16" fill="#ffe8e4" stroke="#2d333b" strokeWidth="2" />
        <circle cx="52" cy="164" r="6" fill="#2d333b" />
        <path d="M42 178 Q52 172 62 178" stroke="#2d333b" strokeWidth="2" fill="none" />

        <circle cx="308" cy="188" r="14" fill="#eef4fd" stroke="#2d333b" strokeWidth="2" />
        <circle cx="308" cy="184" r="5" fill="#2d333b" />
        <path d="M300 194 Q308 189 316 194" stroke="#2d333b" strokeWidth="2" fill="none" />

        {/* Main character — student with laptop */}
        <ellipse cx="180" cy="370" rx="52" ry="10" fill="#2d333b" opacity="0.08" />

        {/* Legs */}
        <path d="M162 320 L152 360 M198 320 L208 360" stroke="#2d333b" strokeWidth="3" strokeLinecap="round" />

        {/* Body / sweater */}
        <path d="M148 268 Q180 252 212 268 L218 322 Q180 332 142 322 Z" fill="#ffe8e4" stroke="#2d333b" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Heart on sweater */}
        <path d="M180 288 C176 282 168 284 168 290 C168 298 180 306 180 306 C180 306 192 298 192 290 C192 284 184 282 180 288Z" fill="#c84c30" opacity="0.7" />

        {/* Arms */}
        <path d="M148 275 L128 300 M212 275 L232 292" stroke="#2d333b" strokeWidth="3" strokeLinecap="round" />

        {/* Laptop */}
        <rect x="118" y="296" width="124" height="18" rx="3" fill="#2d333b" />
        <rect x="122" y="278" width="116" height="20" rx="2" fill="white" stroke="#2d333b" strokeWidth="2" />
        <rect x="128" y="282" width="48" height="4" rx="1" fill="#c84c30" opacity="0.5" />
        <rect x="128" y="289" width="72" height="3" rx="1" fill="#e5e7eb" />

        {/* Head */}
        <circle cx="180" cy="238" r="28" fill="#ffe8e4" stroke="#2d333b" strokeWidth="2.5" />
        {/* Hair */}
        <path d="M154 232 Q160 210 180 208 Q200 210 206 232" fill="#2d333b" />
        {/* Eyes closed */}
        <path d="M168 240 Q172 244 176 240" stroke="#2d333b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M184 240 Q188 244 192 240" stroke="#2d333b" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Smile */}
        <path d="M172 252 Q180 258 188 252" stroke="#2d333b" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>

      <p className="absolute bottom-10 left-0 right-0 text-center text-sm font-sans text-gray-500 px-6 leading-relaxed">
        Make your innovation journey easier with{' '}
        <span className="font-bold text-cozy-dark">InnoTech Hub</span>
      </p>
    </div>
  )
}
