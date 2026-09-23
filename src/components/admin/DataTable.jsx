import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Search, ChevronUp, ChevronDown, MoreVertical, Inbox } from 'lucide-react'

export function RowActionsMenu({ actions }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const visibleActions = actions.filter((a) => !a.hidden)
  if (visibleActions.length === 0) return null

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        aria-label="Row actions"
      >
        <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg shadow-lg z-30 py-1 overflow-hidden">
          {visibleActions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false)
                action.onClick()
              }}
              disabled={action.disabled}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                action.variant === 'danger'
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              {action.icon && <action.icon className="w-4 h-4 shrink-0" />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Generic, self-contained data table: client-side search + sort + pagination.
 *
 * columns: [{ key, label, sortable?, className?, render?(row) }]
 * data: array of row objects (each should have a stable `id`)
 * rowActions?(row): [{ label, icon, onClick, variant, disabled, hidden }]
 * searchKeys?: string[] — fields to match against the search box
 */
export default function DataTable({
  columns,
  data,
  loading = false,
  searchable = true,
  searchKeys = [],
  searchPlaceholder = 'Search…',
  rowActions,
  pageSize = 10,
  emptyIcon: EmptyIcon = Inbox,
  emptyTitle = 'Nothing here yet',
  emptyDescription = '',
  emptyAction,
}) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data
    const q = search.trim().toLowerCase()
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    )
  }, [data, search, searchKeys])

  const sorted = useMemo(() => {
    if (!sort.key) return filtered
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return sort.dir === 'asc' ? av - bv : bv - av
      return sort.dir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return copy
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setPage(1)
  }, [search, data.length])

  const toggleSort = (key) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  return (
    <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-[#404854]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-cozy-light dark:bg-cozy-dark/50 text-sm text-cozy-dark dark:text-cozy-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#0f1419] border-b border-gray-200 dark:border-[#404854]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.className || ''}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-cozy-dark dark:hover:text-cozy-light transition-colors"
                    >
                      {col.label}
                      {sort.key === col.key ? (
                        sort.dir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <span className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {rowActions && <th className="px-4 py-3 w-12" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#252d36]">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${50 + (i % 3) * 15}%` }} />
                    </td>
                  ))}
                  {rowActions && <td className="px-4 py-4" />}
                </tr>
              ))}

            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center gap-2">
                    <EmptyIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    <p className="font-semibold text-cozy-dark dark:text-cozy-light">{emptyTitle}</p>
                    {emptyDescription && <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{emptyDescription}</p>}
                    {emptyAction && <div className="mt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              pageRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#171c23] transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 text-cozy-dark dark:text-cozy-light ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3.5 text-right">
                      <RowActionsMenu actions={rowActions(row)} />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && sorted.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-[#404854]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages} · {sorted.length} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
