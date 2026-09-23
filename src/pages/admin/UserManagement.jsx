import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Users2 } from 'lucide-react'
import { useAdmin, useAdminBreadcrumb } from '../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../lib/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import DataTable from '../../components/admin/DataTable'
import { Badge } from '../../components/dashboard/ui'
import UserModerationDrawer from '../../components/admin/users/UserModerationDrawer'

const STATUS_BADGE = {
  active: { variant: 'success', label: 'Active' },
  deactivated: { variant: 'warning', label: 'Deactivated' },
  banned: { variant: 'error', label: 'Banned' },
}

export default function UserManagement() {
  const { toast } = useAdmin()
  useAdminBreadcrumb([{ label: 'Users' }])

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [collegeFilter, setCollegeFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch('/api/admin/users')
      setUsers(data.users || [])
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const colleges = useMemo(
    () => [...new Set(users.map((u) => u.college).filter(Boolean))].sort(),
    [users]
  )

  const filteredUsers = useMemo(
    () => (collegeFilter ? users.filter((u) => u.college === collegeFilter) : users),
    [users, collegeFilter]
  )

  const patchUserLocally = (id, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
    setSelectedUser((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev))
  }

  const removeUserLocally = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const columns = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <button onClick={() => setSelectedUser(row)} className="text-left hover:text-[#c84c30] transition-colors font-semibold">
          {row.full_name}
        </button>
      ),
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'college', label: 'College', sortable: true, render: (row) => row.college || '—' },
    { key: 'graduation_year', label: 'Grad. Year', sortable: true, render: (row) => row.graduation_year || '—' },
    {
      key: 'status',
      label: 'Active Status',
      sortable: true,
      render: (row) => {
        const cfg = STATUS_BADGE[row.status] || STATUS_BADGE.active
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>
      },
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Student & User Management"
        description="Global directory of every registered student. Click a row to moderate."
      />

      {colleges.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Filter by College</label>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-sm text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
          >
            <option value="">All Colleges</option>
            {colleges.map((college) => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        searchKeys={['full_name', 'email']}
        searchPlaceholder="Search by name or email…"
        emptyIcon={Users2}
        emptyTitle="No students found"
        emptyDescription="Registered students will show up here once the sign-up flow is connected."
      />

      <UserModerationDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdated={(patch) => patchUserLocally(selectedUser.id, patch)}
        onDeleted={() => {
          removeUserLocally(selectedUser.id)
          setSelectedUser(null)
        }}
      />
    </div>
  )
}
