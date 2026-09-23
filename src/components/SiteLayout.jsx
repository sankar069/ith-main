import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import MinimalFooter from './MinimalFooter'
import AppleWindow from './AppleWindow'
import JoinUsModal from './JoinUsModal'
import Mascot from './Mascot'
import { useAppStore } from '../store/useAppStore'
import JoinCommunity from '../pages/JoinCommunity'

export default function SiteLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { openModals, closeModal } = useAppStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="w-full min-h-screen flex flex-col">
      <NavigationBar />

      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

      <MinimalFooter />

      <AppleWindow
        title="about.txt"
        isOpen={openModals.includes('about')}
        onClose={() => closeModal('about')}
      >
        <div className="font-sans space-y-4 text-cozy-dark dark:text-cozy-light">
          <p>hi! we noticed many events were branding-focused and theoretical.</p>
          <p>so we built a student-first ecosystem where every event becomes a learning journey.</p>
          <ul className="list-disc pl-5 space-y-2 text-cozy-primary font-bold">
            <li>hackathons</li>
            <li>workshops</li>
            <li>live sessions</li>
          </ul>
        </div>
      </AppleWindow>

      <AppleWindow
        title="discord.exe"
        isOpen={openModals.includes('community')}
        onClose={() => closeModal('community')}
      >
        <JoinCommunity />
      </AppleWindow>

      <JoinUsModal
        isOpen={openModals.includes('join')}
        onClose={() => closeModal('join')}
      />

      {isHome && <Mascot />}
    </div>
  )
}
