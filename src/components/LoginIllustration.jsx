import React from 'react'

export default function LoginIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Landscape image with fade effect */}
      <img
        src="/login-landscape.png"
        alt="InnoTech Hub Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Fade overlay from edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 dark:from-black/20 dark:via-transparent dark:to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 dark:to-black/40" />

      <p className="absolute bottom-10 left-0 right-0 text-center text-sm font-sans text-gray-600 dark:text-gray-400 px-6 leading-relaxed relative z-10">
        Make your innovation journey easier with{' '}
        <span className="font-bold text-cozy-dark dark:text-cozy-light">InnoTech Hub</span>
      </p>
    </div>
  )
}
