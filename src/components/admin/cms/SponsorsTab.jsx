import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Handshake, ExternalLink } from 'lucide-react'
import { useAdmin } from '../../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../../lib/adminApi'
import { Modal } from '../../dashboard/ui'
import SponsorFormModal from './SponsorFormModal'

export default function SponsorsTab() {
  const { toast } = useAdmin()
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch('/api/admin/cms/sponsors')
      setSponsors(data.sponsors || [])
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load sponsors.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const handleSaved = (sponsor) => {
    setSponsors((prev) => {
      const exists = prev.some((s) => s.id === sponsor.id)
      return exists ? prev.map((s) => (s.id === sponsor.id ? sponsor : s)) : [...prev, sponsor]
    })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/cms/sponsors/${deleteTarget.id}`, { method: 'DELETE' })
      setSponsors((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      toast.success(`${deleteTarget.name} removed.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete sponsor.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditingSponsor(null)
            setFormOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Sponsor
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && sponsors.length === 0 && (
        <div className="bg-white dark:bg-[#1a1f26] border border-dashed border-gray-300 dark:border-[#404854] rounded-lg py-16 flex flex-col items-center gap-2">
          <Handshake className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No sponsors yet. Add your first one above.</p>
        </div>
      )}

      {!loading && sponsors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg p-4 flex flex-col gap-3">
              <div className="h-16 flex items-center justify-center bg-gray-50 dark:bg-[#0f1419] rounded-lg overflow-hidden">
                {sponsor.logo_url ? (
                  <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-14 max-w-full object-contain" />
                ) : (
                  <Handshake className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-cozy-dark dark:text-cozy-light truncate">{sponsor.name}</p>
                {sponsor.category && <p className="text-xs text-gray-500 dark:text-gray-400">{sponsor.category}</p>}
              </div>
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-[#252d36]">
                {sponsor.website_link && (
                  <a href={sponsor.website_link} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                )}
                <button
                  onClick={() => {
                    setEditingSponsor(sponsor)
                    setFormOpen(true)
                  }}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <Pencil className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button onClick={() => setDeleteTarget(sponsor)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SponsorFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} sponsor={editingSponsor} onSaved={handleSaved} />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Remove this sponsor?"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light text-sm font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              {deleting ? 'Removing…' : 'Remove'}
            </button>
          </>
        }
      >
        <p className="text-sm text-cozy-dark dark:text-cozy-light">
          <span className="font-bold">{deleteTarget?.name}</span> will be removed from the public Partners &amp; Sponsors section.
        </p>
      </Modal>
    </div>
  )
}
