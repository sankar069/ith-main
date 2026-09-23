import React, { useEffect, useState } from 'react'
import { Modal, Input, Select } from '../../dashboard/ui'
import UploadField from '../wizard/UploadField'
import { useAdmin } from '../../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../../lib/adminApi'

const CATEGORY_OPTIONS = [
  { value: 'Title Sponsor', label: 'Title Sponsor' },
  { value: 'Platform Partner', label: 'Platform Partner' },
  { value: 'Tooling Partner', label: 'Tooling Partner' },
  { value: 'Community Partner', label: 'Community Partner' },
  { value: 'Media Partner', label: 'Media Partner' },
]

const emptyForm = { name: '', logo_url: '', website_link: '', category: '' }

export default function SponsorFormModal({ isOpen, onClose, sponsor, onSaved }) {
  const { toast } = useAdmin()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(
        sponsor
          ? {
              name: sponsor.name || '',
              logo_url: sponsor.logo_url || '',
              website_link: sponsor.website_link || '',
              category: sponsor.category || '',
            }
          : emptyForm
      )
      setErrors({})
    }
  }, [isOpen, sponsor])

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setErrors({ name: 'Sponsor name is required.' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        logo_url: form.logo_url || null,
        website_link: form.website_link || null,
        category: form.category || null,
      }
      if (sponsor) {
        const data = await adminFetch(`/api/admin/cms/sponsors/${sponsor.id}`, { method: 'PUT', body: payload })
        onSaved(data.sponsor)
        toast.success('Sponsor updated.')
      } else {
        const data = await adminFetch('/api/admin/cms/sponsors', { method: 'POST', body: payload })
        onSaved(data.sponsor)
        toast.success('Sponsor added.')
      }
      onClose()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save sponsor.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
      footer={
        <>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving…' : sponsor ? 'Save Changes' : 'Add Sponsor'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Sponsor Name" required
          value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />
        <UploadField
          label="Logo"
          folder="sponsor-logo"
          accept="image/*"
          value={form.logo_url}
          onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
          onError={(msg) => toast.error(msg)}
        />
        <Input
          label="Website Link"
          value={form.website_link} onChange={(e) => setForm((f) => ({ ...f, website_link: e.target.value }))}
          placeholder="https://…"
        />
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
      </div>
    </Modal>
  )
}
