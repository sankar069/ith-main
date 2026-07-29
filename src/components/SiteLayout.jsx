import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import PixelFooter from './PixelFooter'
import CozyModal from './CozyModal'
import JoinUsModal from './JoinUsModal'
import Mascot from './Mascot'
import { useAppStore } from '../store/useAppStore'
import EventDiscovery from '../pages/EventDiscovery'
import StudentDashboard from '../pages/StudentDashboard'
import JoinCommunity from '../pages/JoinCommunity'
import SaaSProducts from '../pages/SaaSProducts'

export default function SiteLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { openModals, closeModal } = useAppStore()

  return (
    <div className="w-full min-h-screen flex flex-col bg-cozy-light dark:bg-cozy-dark">
      <NavigationBar />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <PixelFooter />

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

      <JoinUsModal
        isOpen={openModals.includes('join')}
        onClose={() => closeModal('join')}
      />

      {isHome && <Mascot />}
    </div>
  )
}
