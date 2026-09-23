import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminProvider, useAdmin } from '../../../contexts/AdminContext'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminToastCenter from '../AdminToastCenter'

function AdminLayoutInner() {
  const { isMobile, setIsMobile } = useAdmin()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsMobile])

  return (
    <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark">
      <AdminSidebar />

      <div className={isMobile ? '' : 'lg:ml-64'}>
        <AdminHeader />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <AdminToastCenter />
    </div>
  )
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  )
}
