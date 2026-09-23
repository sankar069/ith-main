import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStudentStore } from '../store/useStudentStore'

export default function StudentProtectedRoute() {
  const location = useLocation()
  const token = useStudentStore((s) => s.token)

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
