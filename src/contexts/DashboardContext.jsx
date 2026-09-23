import React, { createContext, useContext, useState, useCallback } from 'react'

const DashboardContext = createContext()

// Valid tab ids — kept in sync with DashboardLayout's tabComponents map so a
// stray/unknown ?tab= query param can't land the user on a blank pane.
const VALID_TABS = new Set([
  'overview', 'explore-events', 'my-events', 'requirements',
  'ai-tools', 'certificates', 'projects', 'billing', 'settings',
])

const getInitialTab = () => {
  const requested = new URLSearchParams(window.location.search).get('tab')
  return requested && VALID_TABS.has(requested) ? requested : 'overview'
}

export const DashboardProvider = ({ children }) => {
  // Navigation & UI State — seeded from ?tab= so links like
  // "/dashboard?tab=explore-events" (e.g. a public event card's "Register
  // Now" CTA) land directly on the right tab instead of always Overview.
  const [activeTab, setActiveTab] = useState(getInitialTab)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // User State
  const [user, setUser] = useState(null)
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  // Modals & Drawers
  const [modals, setModals] = useState({
    editProfile: false,
    addProject: false,
    eventDetails: false,
    requirementSheet: false,
    aiToolDetail: false,
    confirmDelete: false,
  })

  // Data State
  const [events, setEvents] = useState([])
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])
  const [transactions, setTransactions] = useState([])
  const [aiTools, setAiTools] = useState([])

  // Loading States
  const [loading, setLoading] = useState({
    events: false,
    projects: false,
    certificates: false,
    transactions: false,
  })

  // Notifications
  const [notifications, setNotifications] = useState([])

  // Modal Handlers
  const openModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }))
  }, [])

  const closeModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }))
  }, [])

  // Tab Navigation
  const switchTab = useCallback((tabName) => {
    setActiveTab(tabName)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  // Notification System
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [])

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    return id
  }, [removeNotification])

  // User Profile
  const updateUserProfile = useCallback((profileData) => {
    setUser(prev => ({ ...prev, ...profileData }))
    setProfileComplete(true)
  }, [])

  const value = {
    // Navigation
    activeTab,
    setActiveTab: switchTab,
    sidebarOpen,
    setSidebarOpen,
    isMobile,
    setIsMobile,

    // User
    user,
    setUser,
    isFirstTimeSetup,
    setIsFirstTimeSetup,
    profileComplete,
    updateUserProfile,

    // Modals
    modals,
    openModal,
    closeModal,

    // Data
    events,
    setEvents,
    projects,
    setProjects,
    certificates,
    setCertificates,
    transactions,
    setTransactions,
    aiTools,
    setAiTools,

    // Loading
    loading,
    setLoading,

    // Notifications
    notifications,
    addNotification,
    removeNotification,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}
