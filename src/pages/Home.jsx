import React, { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Calendar, Users, Cpu, Handshake, Rocket } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useAppStore } from '../store/useAppStore'
import DesktopIcon from '../components/DesktopIcon'
import TractionTelemetry from '../components/TractionTelemetry'
import AboutSection from '../components/AboutSection'
import CultureComparisonSection from '../components/CultureComparisonSection'
import OfficialEventPlatformSection from '../components/OfficialEventPlatformSection'
import EventFlowSection from '../components/EventFlowSection'
import GrowthDashboardSection from '../components/GrowthDashboardSection'
import AISuiteSection from '../components/AISuiteSection'
import ExpertSessionsSection from '../components/ExpertSessionsSection'
import ProductsSaaSSection from '../components/ProductsSaaSSection'
import BusinessModelSection from '../components/BusinessModelSection'
import RoadmapSection from '../components/RoadmapSection'
import MilestonesSection from '../components/MilestonesSection'
import OutcomesSection from '../components/OutcomesSection'
import TeamSection from '../components/TeamSection'
import MediaOutreachSection from '../components/MediaOutreachSection'
import VisionBannerSection from '../components/VisionBannerSection'
import PartnersSponsorsSection from '../components/PartnersSponsorsSection'
import ContactSection from '../components/ContactSection'
import CircularGallery from '../components/CircularGallery'

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDarkMode, openModal } = useAppStore()
  const heroVideoRef = useRef(null)

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (!hash) return
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
    return () => clearTimeout(timer)
  }, [location.hash])

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  return (
    <div className="w-full flex flex-col relative overflow-x-hidden">
      
      {/* Hero Section — landing page only */}
      <section id="home" className="relative isolate w-full flex flex-col items-center justify-start pt-28 md:pt-32 pb-12 overflow-hidden min-h-[85vh]">
        
        {/* Background Video with Smooth Edge Fade */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', 
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' 
            }}
          >
            <source src="/1000108003_landscape_fixed.mp4" type="video/mp4" />
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

        {/* Desktop Icons Container */}
        <div className="relative z-10 flex flex-wrap justify-center max-w-[40rem] mt-12 mb-10">
          <DesktopIcon 
            icon={Calendar} 
            label="Explore Events" 
            onClick={() => openModal('events')} 
          />
          <DesktopIcon 
            icon={Users} 
            label="Join Community" 
            onClick={() => openModal('community')} 
          />
          <DesktopIcon 
            icon={Cpu} 
            label="View SaaS" 
            onClick={() => openModal('saas')} 
          />
          <DesktopIcon 
            icon={Handshake} 
            label="Partner With Us" 
            onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})} 
          />
          <DesktopIcon 
            icon={Rocket} 
            label="Enter Event Platform" 
            onClick={() => navigate('/login')} 
          />
        </div>
      </section>

      <div className="bg-cozy-light dark:bg-cozy-dark">
      {/* Slide 2: Traction Telemetry */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <TractionTelemetry />
      </section>
      </ScrollReveal>

      {/* Slide 3: About Section */}
      <ScrollReveal>
      <section id="about" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <AboutSection />
      </section>
      </ScrollReveal>

      {/* Slide 4: Culture Comparison Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <CultureComparisonSection />
      </section>
      </ScrollReveal>

      {/* Slide 5: Official Event Platform */}
      <ScrollReveal>
      <section id="events" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <OfficialEventPlatformSection />
      </section>
      </ScrollReveal>

      {/* Slide 6: Event Flow Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <EventFlowSection />
      </section>
      </ScrollReveal>

      {/* Slide 7: Growth Dashboard Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <GrowthDashboardSection />
      </section>
      </ScrollReveal>

      {/* Slide 8: AI Suite Section */}
      <ScrollReveal>
      <section id="ai-suite" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <AISuiteSection />
      </section>
      </ScrollReveal>

      {/* Slide 9: Expert Sessions & Podcast Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <ExpertSessionsSection />
      </section>
      </ScrollReveal>

      {/* Slide 10: SaaS Products Section */}
      <ScrollReveal>
      <section id="saas" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <ProductsSaaSSection />
      </section>
      </ScrollReveal>

      {/* Slide 11: Business Model Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <BusinessModelSection />
      </section>
      </ScrollReveal>

      {/* Slide 12: Roadmap Section */}
      <section id="roadmap" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <RoadmapSection />
      </section>

      {/* Slide 13: Key Milestones Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <MilestonesSection />
      </section>
      </ScrollReveal>

      {/* Slide 14: Outcomes Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <OutcomesSection />
      </section>
      </ScrollReveal>

      {/* Slide 14.5: Partners & Sponsors Section */}
      <ScrollReveal>
      <section id="partners" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <PartnersSponsorsSection />
      </section>
      </ScrollReveal>

      {/* Slide 15: Team Section */}
      <ScrollReveal>
      <section id="team" className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <TeamSection />
      </section>
      </ScrollReveal>

      {/* Slide 15.5: Circular Gallery */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative pb-12">
        <div className="w-full flex flex-col items-center pt-20 px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center">
            Gallery Showcase
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-12">
            Swipe through our latest moments.
          </p>
        </div>
        <div style={{ height: '600px', position: 'relative', width: '100%' }}>
          <CircularGallery
            bend={1}
            textColor={isDarkMode ? "#ffffff" : "#1a1a1a"}
            borderRadius={0.05}
            scrollEase={0.05}
            font="bold 30px sans-serif"
            scrollSpeed={2}
            /* 
              TO ADD YOUR OWN IMAGES:
              Uncomment the `items` prop below and fill it with your 12 images.
              Since you want them in color, simply provide normal color image URLs!
            */
            /* items={[
              { image: '/your-image-1.jpg', text: 'Caption 1' },
              { image: '/your-image-2.jpg', text: 'Caption 2' },
              // ... add all 12 here
            ]} */
          />
        </div>
      </section>
      </ScrollReveal>

      {/* Slide 16: Media & Outreach Section */}
      <ScrollReveal>
      <section className="w-full flex flex-col items-center justify-start relative px-4 pb-12">
        <MediaOutreachSection />
      </section>
      </ScrollReveal>

      {/* Slide 17: Vision Banner */}
      <section className="w-full">
        <VisionBannerSection />
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full">
        <ContactSection />
      </section>
      </div>
    </div>
  )
}
