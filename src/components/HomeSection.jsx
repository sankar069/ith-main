import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import PhotoCollageSection from './PhotoCollageSection'

const DEFAULT_HERO_VIDEO = '/1000108003_landscape_fixed.mp4'

export default function HomeSection() {
  const { openModal } = useAppStore()
  const heroVideoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(DEFAULT_HERO_VIDEO)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings?.hero_video_url) setVideoSrc(data.settings.hero_video_url)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    video.load()
    video.play().catch(() => {})
  }, [videoSrc])

  return (
    <section id="home" className="relative isolate w-full flex flex-col items-center justify-start pt-28 md:pt-32 pb-12 overflow-hidden min-h-screen bg-cozy-light dark:bg-cozy-dark">
      
      {/* Background Video - Smooth Fade Edges */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          ref={heroVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-100"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Background Graphic / Greeting */}
      <div className="relative z-10 flex flex-col items-center animate-bobbing px-4 max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/40 bg-white/70 dark:bg-black/30 backdrop-blur-sm text-xs font-semibold tracking-wider text-cozy-dark/90 dark:text-cozy-light/90 shadow-sm">
          ✨ GLOBAL TECH EVENTS & SAAS INNOVATION PLATFORM
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-cozy-dark dark:text-cozy-light text-center drop-shadow-[0_2px_12px_rgba(255,255,255,0.8)]">
          Where Innovation <br/>Meets <span className="text-cozy-primary italic font-serif">Community</span>
        </h1>
        <p className="mt-4 text-sm md:text-base font-mono text-cozy-dark/90 dark:text-cozy-light/90 text-center max-w-2xl px-4 leading-relaxed rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-sm py-4 shadow-sm">
          Discover, attend, and participate in outcome-based hackathons, workshops, summits, and live expert sessions. InnoTech-Hub is building a student-first innovation ecosystem powered by events, AI tools, and scalable SaaS.
        </p>
      </div>

      {/* Floating Join Us CTA */}
      <motion.button
        type="button"
        onClick={() => openModal('join')}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="relative z-10 mt-8 px-12 py-5 md:px-16 md:py-6 rounded-full bg-[#c84c30] hover:bg-[#b04027] text-white font-sans text-base md:text-xl font-bold tracking-wide shadow-[0_20px_45px_-10px_rgba(200,76,48,0.55)] transition-colors"
      >
        Join Us
      </motion.button>

      <div className="w-full mt-auto pt-24 md:pt-28">
        <PhotoCollageSection />
      </div>
    </section>
  )
}
