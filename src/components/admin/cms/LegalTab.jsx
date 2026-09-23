import React, { useEffect, useState, useCallback } from 'react'
import { Send } from 'lucide-react'
import { useAdmin } from '../../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../../lib/adminApi'
import { Skeleton } from '../../dashboard/ui'
import SimpleRichTextEditor from '../wysiwyg/SimpleRichTextEditor'

const PAGES = [
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms-conditions', label: 'Terms & Conditions' },
  { slug: 'platform-rules', label: 'Platform Rules' },
]

export default function LegalTab() {
  const { toast } = useAdmin()
  const [activeSlug, setActiveSlug] = useState('privacy-policy')
  const [content, setContent] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async (slug) => {
    setLoading(true)
    try {
      const data = await adminFetch(`/api/admin/cms/legal/${slug}`)
      setContent(data.page.content_html || '')
      setUpdatedAt(data.page.updated_at)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load page content.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load(activeSlug)
  }, [activeSlug, load])

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = await adminFetch(`/api/admin/cms/legal/${activeSlug}`, { method: 'PUT', body: { content_html: content } })
      setUpdatedAt(data.page.updated_at)
      toast.success('Published — the live site now serves this content.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save page.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {PAGES.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeSlug === p.slug
                ? 'bg-[#c84c30] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton height="260px" />
      ) : (
        <SimpleRichTextEditor value={content} onChange={setContent} />
      )}

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {updatedAt ? `Last published ${new Date(updatedAt).toLocaleString()}` : ''}
        </p>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold disabled:opacity-60"
        >
          <Send className="w-4 h-4" /> {saving ? 'Publishing…' : 'Save & Publish'}
        </button>
      </div>
    </div>
  )
}
