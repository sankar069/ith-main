import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Save, X, Map } from 'lucide-react'
import { useAdmin } from '../../../contexts/AdminContext'
import { adminFetch, ApiError } from '../../../lib/adminApi'
import { Badge, Skeleton } from '../../dashboard/ui'

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning', variant: 'secondary' },
  { value: 'in_progress', label: 'In Progress', variant: 'warning' },
  { value: 'completed', label: 'Completed', variant: 'success' },
]

const statusMeta = (status) => STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]

function ItemForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [feature_name, setFeatureName] = useState(initial?.feature_name || '')
  const [status, setStatus] = useState(initial?.status || 'planning')
  const [target_date, setTargetDate] = useState(initial?.target_date || '')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!feature_name.trim()) {
      setError('Feature name is required.')
      return
    }
    onSubmit({ feature_name: feature_name.trim(), status, target_date: target_date || null })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-start p-3 bg-gray-50 dark:bg-[#0f1419] rounded-lg">
      <div>
        <input
          value={feature_name}
          onChange={(e) => setFeatureName(e.target.value)}
          placeholder="Feature name"
          className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30] ${
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-sm text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <input
        type="date"
        value={target_date || ''}
        onChange={(e) => setTargetDate(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-sm text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
      />
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="p-2 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white" aria-label={submitLabel}>
          <Save className="w-4 h-4" />
        </button>
        <button onClick={onCancel} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500" aria-label="Cancel">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function RoadmapTab() {
  const { toast } = useAdmin()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch('/api/admin/cms/roadmap')
      setItems(data.items || [])
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load roadmap.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async (payload) => {
    try {
      const data = await adminFetch('/api/admin/cms/roadmap', { method: 'POST', body: payload })
      setItems((prev) => [...prev, data.item])
      toast.success('Roadmap item added.')
      setAdding(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add item.')
    }
  }

  const handleEdit = async (id, payload) => {
    try {
      const data = await adminFetch(`/api/admin/cms/roadmap/${id}`, { method: 'PUT', body: payload })
      setItems((prev) => prev.map((i) => (i.id === id ? data.item : i)))
      toast.success('Roadmap item updated.')
      setEditingId(null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update item.')
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await adminFetch(`/api/admin/cms/roadmap/${id}`, { method: 'DELETE' })
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success('Roadmap item removed.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to remove item.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Roadmap Item
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4">
          <ItemForm onSubmit={handleAdd} onCancel={() => setAdding(false)} submitLabel="Add item" />
        </div>
      )}

      {loading ? (
        <Skeleton height="52px" count={3} />
      ) : items.length === 0 && !adding ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-dashed border-gray-300 dark:border-[#404854] rounded-lg py-16 flex flex-col items-center gap-2">
          <Map className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No roadmap items yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) =>
            editingId === item.id ? (
              <ItemForm
                key={item.id}
                initial={item}
                onSubmit={(payload) => handleEdit(item.id, payload)}
                onCancel={() => setEditingId(null)}
                submitLabel="Save"
              />
            ) : (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg"
              >
                <p className="flex-1 font-semibold text-sm text-cozy-dark dark:text-cozy-light">{item.feature_name}</p>
                <Badge variant={statusMeta(item.status).variant}>{statusMeta(item.status).label}</Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400 w-24 text-right">
                  {item.target_date ? new Date(item.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setEditingId(item.id)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900">
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
