import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Construction, ArrowLeft } from 'lucide-react'
import { useAdminBreadcrumb } from '../../contexts/AdminContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

export default function ComingSoon({ title, description, phaseNote }) {
  const navigate = useNavigate()
  useAdminBreadcrumb([{ label: title }], [title])

  return (
    <div>
      <AdminPageHeader title={title} description={description} />

      <div className="bg-white dark:bg-[#1a1f26] border border-dashed border-gray-300 dark:border-[#404854] rounded-lg py-16 px-6 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-[#c84c30]/10 flex items-center justify-center">
          <Construction className="w-7 h-7 text-[#c84c30]" />
        </div>
        <p className="font-bold text-cozy-dark dark:text-cozy-light">Coming in a later phase</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {phaseNote || 'This module is planned but not built yet. Ask to build it next and it\'ll be added here.'}
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </button>
      </div>
    </div>
  )
}
