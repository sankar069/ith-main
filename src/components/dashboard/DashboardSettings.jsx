import React, { useState } from 'react'
import { Bell, Lock, Save } from 'lucide-react'

export default function DashboardSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: false,
    eventReminders: true,
    profilePublic: false,
    twoFactorAuth: false,
  })

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-cozy-light to-gray-50 dark:from-cozy-dark dark:to-[#1a1f26]">
      
      <h1 className="text-3xl font-serif font-bold text-cozy-dark dark:text-white">Settings</h1>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/10">
        <h2 className="text-2xl font-serif font-bold text-cozy-dark dark:text-white mb-6 flex items-center gap-3">
          <Bell className="w-6 h-6 text-[#c84c30]" /> Notification Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
            </div>
            <label className="relative inline-block w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="sr-only peer"
              />
              <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                settings.emailNotifications ? 'translate-x-6 bg-[#c84c30]' : ''
              }`} />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">WhatsApp Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get alerts on WhatsApp</p>
            </div>
            <label className="relative inline-block w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer">
              <input
                type="checkbox"
                checked={settings.whatsappNotifications}
                onChange={() => handleToggle('whatsappNotifications')}
                className="sr-only peer"
              />
              <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                settings.whatsappNotifications ? 'translate-x-6 bg-[#c84c30]' : ''
              }`} />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Event Reminders</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reminders for registered events</p>
            </div>
            <label className="relative inline-block w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer">
              <input
                type="checkbox"
                checked={settings.eventReminders}
                onChange={() => handleToggle('eventReminders')}
                className="sr-only peer"
              />
              <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                settings.eventReminders ? 'translate-x-6 bg-[#c84c30]' : ''
              }`} />
            </label>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/10">
        <h2 className="text-2xl font-serif font-bold text-cozy-dark dark:text-white mb-6 flex items-center gap-3">
          <Lock className="w-6 h-6 text-[#c84c30]" /> Privacy & Security
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Public Profile</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Allow others to view your profile</p>
            </div>
            <label className="relative inline-block w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer">
              <input
                type="checkbox"
                checked={settings.profilePublic}
                onChange={() => handleToggle('profilePublic')}
                className="sr-only peer"
              />
              <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                settings.profilePublic ? 'translate-x-6 bg-[#c84c30]' : ''
              }`} />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
            </div>
            <label className="relative inline-block w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
                className="sr-only peer"
              />
              <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                settings.twoFactorAuth ? 'translate-x-6 bg-[#c84c30]' : ''
              }`} />
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="px-6 py-3 bg-[#c84c30] text-white rounded-lg font-semibold hover:bg-[#b84027] transition flex items-center gap-2">
        <Save className="w-5 h-5" /> Save Settings
      </button>

    </div>
  )
}
