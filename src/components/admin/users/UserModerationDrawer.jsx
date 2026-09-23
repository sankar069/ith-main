import React, { useEffect, useState } from 'react'
import { ShieldOff, ShieldCheck, Trash2, Save, AlertTriangle } from 'lucide-react'
import { Drawer, Input, Badge } from '../../dashboard/ui'
import { useAdmin } from '../../../contexts/AdminContext'
import { useAdminStore } from '../../../store/useAdminStore'
import { adminFetch, ApiError } from '../../../lib/adminApi'

const STATUS_BADGE = {
  active: { variant: 'success', label: 'Active' },
  deactivated: { variant: 'warning', label: 'Deactivated' },
  banned: { variant: 'error', label: 'Banned' },
}

export default function UserModerationDrawer({ user, onClose, onUpdated, onDeleted }) {
  const { toast } = useAdmin()
  const isSuperAdmin = useAdminStore((s) => s.isSuperAdmin())

  const [form, setForm] = useState({ full_name: '', email: '', phone: '', college: '', graduation_year: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [confirmingBan, setConfirmingBan] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        college: user.college || '',
        graduation_year: user.graduation_year || '',
      })
      setErrors({})
      setConfirmingBan(false)
      setDeleteConfirmText('')
    }
  }, [user])

  if (!user) return null

  const handleSaveEdit = async () => {
    const nextErrors = {}
    if (!form.full_name.trim()) nextErrors.full_name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const data = await adminFetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        body: {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone: form.phone,
          college: form.college,
          graduation_year: form.graduation_year === '' ? null : Number(form.graduation_year),
        },
      })
      onUpdated(data.user)
      toast.success('User details updated.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update user.')
    } finally {
      setSaving(false)
    }
  }

  const changeStatus = async (status, successMessage) => {
    setStatusUpdating(true)
    try {
      const data = await adminFetch(`/api/admin/users/${user.id}/status`, { method: 'PATCH', body: { status } })
      onUpdated(data.user)
      toast.success(successMessage)
      setConfirmingBan(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update status.')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      toast.success(`${user.full_name} was permanently deleted.`)
      onDeleted()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete user.')
    } finally {
      setDeleting(false)
    }
  }

  const statusCfg = STATUS_BADGE[user.status] || STATUS_BADGE.active
  const canDelete = isSuperAdmin && deleteConfirmText.trim() === user.email

  return (
    <Drawer isOpen={!!user} onClose={onClose} title="Moderate Student" width="w-full max-w-md">
      <div className="space-y-8 pb-4">
        {/* Current status */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current status</p>
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        </div>

        {/* Edit form */}
        <div>
          <h3 className="text-sm font-bold text-cozy-dark dark:text-cozy-light uppercase tracking-wider mb-3">Edit Data</h3>
          <div className="space-y-4">
            <Input label="Full Name" required value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} error={errors.full_name} />
            <Input label="Email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <Input label="College" value={form.college} onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))} />
            <Input label="Graduation Year" type="number" value={form.graduation_year} onChange={(e) => setForm((f) => ({ ...f, graduation_year: e.target.value }))} />
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Access control */}
        <div>
          <h3 className="text-sm font-bold text-cozy-dark dark:text-cozy-light uppercase tracking-wider mb-3">Access Control</h3>

          {user.status === 'banned' ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">This user is banned from the platform.</p>
              <button
                onClick={() => changeStatus('active', `${user.full_name} has been unbanned and reactivated.`)}
                disabled={statusUpdating}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#1a1f26] border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-semibold disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" /> Remove Ban
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-[#404854] cursor-pointer">
                <span className="text-sm font-medium text-cozy-dark dark:text-cozy-light">Account Active</span>
                <span className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user.status === 'active'}
                    disabled={statusUpdating}
                    onChange={(e) =>
                      changeStatus(
                        e.target.checked ? 'active' : 'deactivated',
                        e.target.checked ? `${user.full_name} reactivated.` : `${user.full_name} deactivated.`
                      )
                    }
                  />
                  <span className="w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-[#c84c30] transition-colors" />
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                </span>
              </label>

              {!confirmingBan ? (
                <button
                  onClick={() => setConfirmingBan(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <ShieldOff className="w-4 h-4" /> Ban User
                </button>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 space-y-2">
                  <p className="text-xs text-red-700 dark:text-red-300">Ban {user.full_name}? They'll lose all platform access immediately.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmingBan(false)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-semibold text-cozy-dark dark:text-cozy-light"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => changeStatus('banned', `${user.full_name} has been banned.`)}
                      disabled={statusUpdating}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold disabled:opacity-60"
                    >
                      Confirm Ban
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danger zone — Super Admin only */}
        {isSuperAdmin && (
          <div>
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h3>
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Permanently delete this user and all associated data. This cannot be undone. Type{' '}
                <span className="font-mono font-bold text-cozy-dark dark:text-cozy-light">{user.email}</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={user.email}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-sm text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleDelete}
                disabled={!canDelete || deleting}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Delete User Permanently'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}
