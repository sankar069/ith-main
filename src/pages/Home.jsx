import React from 'react'
import { Calendar, Users, Cpu, Handshake, Rocket, Moon, Sun } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import NavigationBar from '../components/NavigationBar'
import { useAppStore } from '../store/useAppStore'
import DesktopIcon from '../components/DesktopIcon'
import CozyModal from '../components/CozyModal'
import Mascot from '../components/Mascot'
import EventDiscovery from './EventDiscovery'
import StudentDashboard from './StudentDashboard'
import JoinCommunity from './JoinCommunity'
import SaaSProducts from './SaaSProducts'
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
import PixelFooter from '../components/PixelFooter'
import CircularGallery from '../components/CircularGallery'

export default function Home() {
  const { isDarkMode, toggleDarkMode, openModals, openModal, closeModal } = useAppStore()

  return (
    <div className="w-full flex flex-col relative overflow-x-hidden min-h-screen">
      <NavigationBar />
      
      {/* Slide 1: Hero Section */}
      <section id="home" className="w-full flex flex-col items-center justify-start relative pt-[15vh] pb-12 overflow-hidden">
        
        {/* Background Video with Smooth Edge Fade */}
        <div className="absolute inset-0 w-full h-full -z-20">
          <video
            autoPlay
            loop
            muted
            playsInline
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
        <div className="flex flex-col items-center animate-bobbing px-4 relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/20 dark:border-cozy-light/20 bg-white/50 dark:bg-black/20 text-xs font-semibold tracking-wider text-cozy-dark/80 dark:text-cozy-light/80">
            ✨ GLOBAL TECH EVENTS & SAAS INNOVATION PLATFORM
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-cozy-dark dark:text-cozy-light drop-shadow-sm text-center">
            Where Innovation <br/>Meets <span className="text-cozy-primary italic font-serif">Community</span>
          </h1>
          <p className="mt-4 text-sm md:text-base font-mono text-cozy-dark/80 dark:text-cozy-light/80 text-center max-w-2xl px-4 leading-relaxed">
            Discover, attend, and participate in outcome-based hackathons, workshops, summits, and live expert sessions. InnoTech-Hub is building a student-first innovation ecosystem powered by events, AI tools, and scalable SaaS.
          </p>
        </div>

      {/* Theme Toggle Navbar (Top Right) */}
      <nav className="absolute top-4 right-4 flex gap-4">
        <button 
          onClick={toggleDarkMode}
          className="p-3 bg-white/80 dark:bg-black/50 border-2 border-cozy-dark/10 dark:border-cozy-light/10 rounded-full hover:scale-110 active:scale-90 transition-transform drop-shadow-flat"
        >
          {isDarkMode ? <Sun className="text-cozy-light w-6 h-6" /> : <Moon className="text-cozy-dark w-6 h-6" />}
        </button>
      </nav>

        {/* Desktop Icons Container */}
        <div className="z-10 flex flex-wrap justify-center max-w-[40rem] mt-12 mb-10">
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
            onClick={() => document.getElementById('contact-section')?.scrollIntoView({behavior: 'smooth'})} 
          />
          <DesktopIcon 
            icon={Rocket} 
            label="Enter Event Platform" 
            onClick={() => window.location.href = '/login'} 
          />
        </div>
      </section>

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

      {/* Footer Section */}
      <PixelFooter />

      {/* Modals */}
      <CozyModal 
        title="event_discovery.exe" 
        isOpen={openModals.includes('events')} 
        onClose={() => closeModal('events')}
      >
        <EventDiscovery />
      </CozyModal>

      <CozyModal 
        title="student_dashboard.exe" 
        isOpen={openModals.includes('dashboard')} 
        onClose={() => closeModal('dashboard')}
      >
        <StudentDashboard />
      </CozyModal>

      <CozyModal 
        title="about.txt" 
        isOpen={openModals.includes('about')} 
        onClose={() => closeModal('about')}
      >
        <div className="font-mono space-y-4">
          <p>hi! we noticed many events were branding-focused and theoretical.</p>
          <p>so we built a student-first ecosystem where every event becomes a learning journey.</p>
          <ul className="list-disc pl-5 space-y-2 text-cozy-primary font-bold">
            <li>hackathons</li>
            <li>workshops</li>
            <li>live sessions</li>
          </ul>
        </div>
      </CozyModal>

      <CozyModal 
        title="discord.exe" 
        isOpen={openModals.includes('community')} 
        onClose={() => closeModal('community')}
      >
        <JoinCommunity />
      </CozyModal>

      <CozyModal 
        title="saas_suite.exe" 
        isOpen={openModals.includes('saas')} 
        onClose={() => closeModal('saas')}
      >
        <SaaSProducts />
      </CozyModal>

      <Mascot />
    </div>
  )
}
