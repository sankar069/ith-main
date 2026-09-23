import React, { useEffect, useState, useCallback } from 'react'
import { Save } from 'lucide-react'
import { useAdmin } from '../../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../../lib/adminApi'
import { Input, Skeleton } from '../../dashboard/ui'
import UploadField from '../wizard/UploadField'

const DEFAULTS = {
  hero_video_url: '',
  promo_banner_url: '',
  discord_link: '',
  whatsapp_link: '',
}

export default function MediaLinksTab() {
  const { toast } = useAdmin()
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch('/api/admin/cms/settings')
      setSettings({ ...DEFAULTS, ...data.settings })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load site settings.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminFetch('/api/admin/cms/settings', { method: 'PUT', body: { settings } })
      toast.success('Media & links updated.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton height="56px" count={4} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h3 className="text-sm font-bold text-cozy-dark dark:text-cozy-light uppercase tracking-wider mb-3">Homepage Media</h3>
        <div className="space-y-4">
          <Input
            label="Homepage Hero Video URL"
            value={settings.hero_video_url}
            onChange={(e) => update('hero_video_url', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            helperText="Embedded on the homepage hero section."
          />
          <UploadField
            label="Promotional Banner"
            folder="promo-banner"
            accept="image/*"
            value={settings.promo_banner_url}
            onChange={(url) => update('promo_banner_url', url)}
            onError={(msg) => toast.error(msg)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-cozy-dark dark:text-cozy-light uppercase tracking-wider mb-3">Global Links</h3>
        <div className="space-y-4">
          <Input
            label="Discord Community Link"
            value={settings.discord_link}
            onChange={(e) => update('discord_link', e.target.value)}
            placeholder="https://discord.gg/…"
          />
          <Input
            label="WhatsApp Community Link"
            value={settings.whatsapp_link}
            onChange={(e) => update('whatsapp_link', e.target.value)}
            placeholder="https://chat.whatsapp.com/…"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
