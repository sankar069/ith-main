import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [toasts, setToasts] = useState([])
  // [{ label, path? }] — path optional on the last (current) crumb.
  const [breadcrumb, setBreadcrumb] = useState([{ label: 'Overview' }])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  }

  const value = {
    sidebarOpen,
    setSidebarOpen,
    isMobile,
    setIsMobile,
    toasts,
    addToast,
    removeToast,
    toast,
    breadcrumb,
    setBreadcrumb,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

// Convenience hook: pages call useAdminBreadcrumb([{label:'Events', path:'/admin/events'}, {label:'New Event'}])
// once on mount (or whenever `deps` change, e.g. after an event name loads).
export const useAdminBreadcrumb = (crumbs, deps = []) => {
  const { setBreadcrumb } = useAdmin()
  useEffect(() => {
    setBreadcrumb(crumbs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
