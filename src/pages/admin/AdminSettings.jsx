import React, { useEffect, useState, useCallback } from 'react'
import { Save, KeyRound, UserPlus, Trash2, Users as UsersIcon } from 'lucide-react'
import { useAdmin, useAdminBreadcrumb } from '../../contexts/AdminContext'
import { useAdminStore } from '../../store/useAdminStore'
import { adminFetch, ApiError } from '../../lib/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import UploadField from '../../components/admin/wizard/UploadField'
import { Input, Select, Badge, Card, Skeleton } from '../../components/dashboard/ui'

function ProfileSection() {
  const { toast } = useAdmin()
  const [form, setForm] = useState({ display_name: '', email: '', avatar_url: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminFetch('/api/admin/profile')
      .then((data) =>
        setForm({
          display_name: data.profile.display_name || '',
          email: data.profile.email || '',
          avatar_url: data.profile.avatar_url || '',
        })
      )
      .catch((err) => toast.error(err instanceof ApiError ? err.message : 'Failed to load profile.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = await adminFetch('/api/admin/profile', { method: 'PUT', body: form })
      toast.success(
        data.emailChanged
          ? 'Profile updated. Use your new email next time you log in.'
          : 'Profile updated.'
      )
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <h2 className="font-bold text-cozy-dark dark:text-cozy-light mb-4">Admin Profile</h2>
        <div className="max-w-lg">
          <Skeleton height="20px" count={3} />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="font-bold text-cozy-dark dark:text-cozy-light mb-4">Admin Profile</h2>
      <div className="space-y-4 max-w-lg">
        <UploadField
          label="Avatar"
          folder="avatar"
          accept="image/*"
          value={form.avatar_url}
          onChange={(url) => setForm((f) => ({ ...f, avatar_url: url }))}
          onError={(msg) => toast.error(msg)}
        />
        <Input
          label="Display Name"
          value={form.display_name}
          onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
        />
        <Input
          label="Contact Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          helperText="Changing this changes your login email too."
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </Card>
  )
}

function PasswordSection() {
  const { toast } = useAdmin()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const next = {}
    if (!form.currentPassword) next.currentPassword = 'Enter your current password.'
    if (!form.newPassword || form.newPassword.length < 8) next.newPassword = 'New password must be at least 8 characters.'
    if (form.newPassword !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSaving(true)
    try {
      await adminFetch('/api/admin/change-password', {
        method: 'POST',
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      })
      toast.success('Password updated.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="font-bold text-cozy-dark dark:text-cozy-light mb-4">Change Password</h2>
      <div className="space-y-4 max-w-lg">
        <Input
          label="Current Password" type="password" required
          value={form.currentPassword}
          onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
          error={errors.currentPassword}
        />
        <Input
          label="New Password" type="password" required
          value={form.newPassword}
          onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
          error={errors.newPassword}
          helperText="At least 8 characters."
        />
        <Input
          label="Confirm New Password" type="password" required
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
        >
          <KeyRound className="w-4 h-4" /> {saving ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </Card>
  )
}

const ROLE_OPTIONS = [
  { value: 'event_manager', label: 'Event Manager' },
  { value: 'super_admin', label: 'Super Admin' },
]

function TeamSection() {
  const { toast } = useAdmin()
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'event_manager' })
  const [inviting, setInviting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch('/api/admin/team')
      setTeam(data.team || [])
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load team.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const handleInvite = async () => {
    if (!/^\S+@\S+\.\S+$/.test(inviteForm.email)) {
      toast.error('Enter a valid email address.')
      return
    }
    setInviting(true)
    try {
      const data = await adminFetch('/api/admin/team', { method: 'POST', body: inviteForm })
      setTeam((prev) => [...prev, data.member])
      toast.success(`${inviteForm.email} invited as ${inviteForm.role === 'super_admin' ? 'Super Admin' : 'Event Manager'}.`)
      setInviteForm({ email: '', role: 'event_manager' })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to invite team member.')
    } finally {
      setInviting(false)
    }
  }

  const handleRemove = async (member) => {
    try {
      await adminFetch(`/api/admin/team/${member.id}`, { method: 'DELETE' })
      setTeam((prev) => prev.filter((m) => m.id !== member.id))
      toast.success(`${member.email} removed from the team.`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to remove team member.')
    }
  }

  return (
    <Card>
      <h2 className="font-bold text-cozy-dark dark:text-cozy-light mb-1">Sub-Admin Management</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Invited members appear below immediately. Note: they can't sign in yet — there's no invite-accept/password-set
        email flow wired up, so this currently tracks who has been granted access rather than issuing working logins.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl">
        <div className="flex-1">
          <Input
            placeholder="teammate@example.com"
            value={inviteForm.email}
            onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={ROLE_OPTIONS}
            value={inviteForm.role}
            onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
          />
        </div>
        <button
          onClick={handleInvite}
          disabled={inviting}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60 shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Invite
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading team…</p>
      ) : team.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No team members yet.</p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-[#252d36] border border-gray-200 dark:border-[#404854] rounded-lg overflow-hidden">
          {team.map((member) => (
            <div key={member.id} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1a1f26]">
              <div className="w-8 h-8 rounded-full bg-[#c84c30]/10 flex items-center justify-center shrink-0">
                <UsersIcon className="w-4 h-4 text-[#c84c30]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cozy-dark dark:text-cozy-light truncate">
                  {member.display_name || member.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
              </div>
              <Badge variant={member.role === 'super_admin' ? 'primary' : 'secondary'}>
                {member.role === 'super_admin' ? 'Super Admin' : 'Event Manager'}
              </Badge>
              <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                {member.status === 'active' ? 'Active' : 'Invited'}
              </Badge>
              <button onClick={() => handleRemove(member)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function AdminSettings() {
  useAdminBreadcrumb([{ label: 'Settings' }])
  const isSuperAdmin = useAdminStore((s) => s.isSuperAdmin())

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Admin Settings" description="Manage your profile, security, and team access." />
      <ProfileSection />
      <PasswordSection />
      {isSuperAdmin && <TeamSection />}
    </div>
  )
}
