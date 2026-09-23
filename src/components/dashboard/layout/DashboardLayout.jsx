import React, { useEffect } from 'react'
import { useDashboard } from '../../../contexts/DashboardContext'
import DashboardTopNav from './DashboardTopNav'
import NotificationCenter from '../NotificationCenter'

// Import tab content components
import OverviewTab from '../tabs/OverviewTab'
import ExploreEventsTab from '../tabs/ExploreEventsTab'
import MyEventsTab from '../tabs/MyEventsTab'
import RequirementsTab from '../tabs/RequirementsTab'
import AISuiteTab from '../tabs/AISuiteTab'
import CertificatesTab from '../tabs/CertificatesTab'
import ProjectsTab from '../tabs/ProjectsTab'
import BillingTab from '../tabs/BillingTab'
import SettingsTab from '../tabs/SettingsTab'

const tabComponents = {
  overview: OverviewTab,
  'explore-events': ExploreEventsTab,
  'my-events': MyEventsTab,
  requirements: RequirementsTab,
  'ai-tools': AISuiteTab,
  certificates: CertificatesTab,
  projects: ProjectsTab,
  billing: BillingTab,
  settings: SettingsTab,
}

export default function DashboardLayout() {
  const { activeTab, setIsMobile } = useDashboard()

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsMobile])

  const CurrentTabComponent = tabComponents[activeTab] || OverviewTab

  return (
    <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark flex flex-col">
      {/* HackerRank-style Top Navigation */}
      <DashboardTopNav />

      {/* Main Content Area - Full width (no sidebar margin) */}
      <div className="flex-1 flex flex-col">
        {/* Page Content - Grows to fill available space */}
        <main className="p-4 md:p-6 lg:p-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            {/* Tab Content with smooth transition */}
            <div className="animate-fade-in">
              <CurrentTabComponent />
            </div>
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter />
    </div>
  )
}
