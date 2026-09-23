import React from 'react'
import { DashboardProvider } from '../contexts/DashboardContext'
import DashboardLayout from '../components/dashboard/layout/DashboardLayout'

export default function StudentDashboard() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  )
}
