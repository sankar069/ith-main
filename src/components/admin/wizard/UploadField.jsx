import React, { useRef, useState } from 'react'
import { UploadCloud, FileCheck2, X, Loader2 } from 'lucide-react'
import { adminUploadFile, ApiError } from '../../../lib/adminApi'

/**
 * Single-file upload field. Uploads immediately on selection via
 * /api/admin/upload and reports the resulting URL back to the parent form.
 */
export default function UploadField({ label, helperText, folder, accept, value, onChange, onError }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const { url } = await adminUploadFile(file, folder)
      onChange(url)
    } catch (err) {
      onError?.(err instanceof ApiError ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">{label}</label>}

      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-cozy-light dark:bg-cozy-dark/50">
          <FileCheck2 className="w-5 h-5 text-green-600 shrink-0" />
          <a href={value} target="_blank" rel="noreferrer" className="text-sm text-[#c84c30] truncate flex-1 hover:underline">
            {value}
          </a>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0"
            aria-label="Remove file"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#c84c30] hover:bg-[#c84c30]/5 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-[#c84c30] animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {uploading ? 'Uploading…' : 'Click to upload'}
          </span>
        </button>
      )}

      {helperText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
