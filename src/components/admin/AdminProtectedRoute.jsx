import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminStore } from '../../store/useAdminStore'
import { adminFetch } from '../../lib/adminApi'

export default function AdminProtectedRoute() {
  const location = useLocation()
  const token = useAdminStore((s) => s.token)
  const login = useAdminStore((s) => s.login)
  const logout = useAdminStore((s) => s.logout)
  const sessionStatus = useAdminStore((s) => s.sessionStatus)
  const setSessionStatus = useAdminStore((s) => s.setSessionStatus)

  useEffect(() => {
    if (!token) {
      setSessionStatus('ready')
      return
    }
    if (sessionStatus !== 'idle') return

    setSessionStatus('checking')
    adminFetch('/api/admin/me')
      .then((data) => {
        // Refresh the stored admin profile from the server response so the
        // shell always reflects the real role/display name.
        login(token, data.admin)
      })
      .catch(() => {
        logout()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (sessionStatus !== 'ready') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cozy-light dark:bg-cozy-dark">
        <p className="text-sm text-gray-500 dark:text-gray-400">Verifying session…</p>
      </div>
    )
  }

  return <Outlet />
}
