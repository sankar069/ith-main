import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Skeleton } from '../ui'
import { Lock, Bell, Trash2, Shield, Save, X, Globe, Copy, Check } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { studentFetch, StudentApiError } from '../../../lib/studentApi'
import { supabase } from '../../../lib/supabaseClient'

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState('account')
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const { addNotification } = useDashboard()

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [userId, setUserId] = useState('')
  const [profilePublic, setProfilePublic] = useState(false)
  const [togglingPublic, setTogglingPublic] = useState(false)
  const [copied, setCopied] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true)
    try {
      const data = await studentFetch('/api/student/profile')
      setEmail(data.profile?.email || '')
      setFullName(data.profile?.full_name || '')
      setUserId(data.profile?.id || '')
      setProfilePublic(!!data.profile?.profile_public)
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to load your profile.', 'error')
    } finally {
      setLoadingProfile(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await studentFetch('/api/student/profile', {
        method: 'PUT',
        body: { full_name: fullName },
      })
      addNotification('Profile updated.', 'success')
      setUnsavedChanges(false)
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to save changes.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublic = async (next) => {
    setTogglingPublic(true)
    try {
      await studentFetch('/api/student/profile', { method: 'PUT', body: { profile_public: next } })
      setProfilePublic(next)
      addNotification(next ? 'Your public profile is now live.' : 'Your public profile is now private.', 'success')
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to update visibility.', 'error')
    } finally {
      setTogglingPublic(false)
    }
  }

  const publicUrl = userId ? `${window.location.origin}/u/${userId}` : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    if (!currentPassword) {
      setPasswordError('Enter your current password.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    setChangingPassword(true)
    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
      if (verifyError) {
        setPasswordError('Current password is incorrect.')
        return
      }
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      addNotification('Password updated.', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.')
    } finally {
      setChangingPassword(false)
    }
  }

  const sections = [
    { id: 'account', label: 'Account Settings', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light">Settings & Preferences</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account, notifications, and privacy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="space-y-2 sticky top-24">
            {sections.map(section => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left ${
                    activeSection === section.id
                      ? 'bg-[#c84c30] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{section.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Account Settings */}
          {activeSection === 'account' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email & Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingProfile ? (
                    <Skeleton height="40px" count={2} />
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Email Address</label>
                        <Input value={email} disabled className="mt-2" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Full Name</label>
                        <Input
                          value={fullName}
                          className="mt-2"
                          onChange={(e) => {
                            setFullName(e.target.value)
                            setUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="primary"
                          className="flex items-center gap-2"
                          onClick={handleSaveProfile}
                          disabled={saving || !unsavedChanges}
                        >
                          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
                        </Button>
                        {unsavedChanges && (
                          <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                              loadProfile()
                              setUnsavedChanges(false)
                            }}
                          >
                            <X className="w-4 h-4" /> Discard
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Public Innovator Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Make my profile public</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Share a public page with your stats, skills, and earned certificates.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={profilePublic}
                      disabled={togglingPublic}
                      onClick={() => handleTogglePublic(!profilePublic)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                        profilePublic ? 'bg-[#c84c30]' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profilePublic ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  {profilePublic && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <Input value={publicUrl} disabled className="flex-1 text-xs" />
                      <Button variant="outline" className="flex items-center gap-2 shrink-0" onClick={handleCopyLink}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Link'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passwordError && (
                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                      {passwordError}
                    </p>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Current Password</label>
                    <Input
                      type="password" placeholder="••••••••" className="mt-2"
                      value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">New Password</label>
                    <Input
                      type="password" placeholder="••••••••" className="mt-2"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Confirm New Password</label>
                    <Input
                      type="password" placeholder="••••••••" className="mt-2"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button variant="primary" onClick={handleChangePassword} disabled={changingPassword}>
                    {changingPassword ? 'Updating…' : 'Update Password'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Event Reminders', desc: 'Get notified about upcoming events' },
                    { label: 'Achievement Updates', desc: 'Celebrate your milestones' },
                    { label: 'AI Tool Tips', desc: 'Learn how to use AI tools better' },
                    { label: 'Community Updates', desc: 'Latest news from InnoTech-Hub' },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <p className="font-medium text-cozy-dark dark:text-cozy-light">{notif.label}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{notif.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </div>
                  ))}
                  <Button variant="primary" className="w-full mt-4">Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy & Security */}
          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Profile Visibility', options: ['Public', 'Private', 'Friends Only'], selected: 'Public' },
                    { label: 'Show My Achievements', options: ['Yes', 'No'], selected: 'Yes' },
                    { label: 'Allow Others to See Projects', options: ['Yes', 'No'], selected: 'Yes' },
                  ].map((setting, i) => (
                    <div key={i}>
                      <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">{setting.label}</label>
                      <select className="w-full mt-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#404854] bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light">
                        {setting.options.map(opt => (
                          <option key={opt} selected={opt === setting.selected}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <Button variant="primary" className="w-full">Save Privacy Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-medium text-cozy-dark dark:text-cozy-light">Authenticator App</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Secure your account with 2FA</p>
                    </div>
                    <Badge variant="secondary">Not Enabled</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-3">Enable 2FA</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <div className="space-y-4">
              <Card className="border-red-300 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-red-900 dark:text-red-100 mb-2">Log Out from All Devices</p>
                    <p className="text-sm text-red-800 dark:text-red-200 mb-4">You'll be logged out from all active sessions</p>
                    <Button variant="danger">Log Out All Devices</Button>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-red-900 dark:text-red-100 mb-2">Delete Account</p>
                    <p className="text-sm text-red-800 dark:text-red-200 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
                    <Button variant="danger">Delete My Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
