import React, { useRef, useState } from 'react'
import { X, Loader2, Image as ImageIcon } from 'lucide-react'
import { adminUploadFile, ApiError } from '../../../lib/adminApi'

export default function GalleryUploadField({ label, helperText, folder, accept, values = [], onChange, onError }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      const urls = []
      for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        const { url } = await adminUploadFile(file, folder)
        urls.push(url)
      }
      onChange([...values, ...urls])
    } catch (err) {
      onError?.(err instanceof ApiError ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeAt = (idx) => onChange(values.filter((_, i) => i !== idx))

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">{label}</label>}

      {values.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {values.map((url, i) => (
            <div key={url + i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#c84c30] hover:bg-[#c84c30]/5 transition-colors disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 text-[#c84c30] animate-spin" />
        ) : (
          <ImageIcon className="w-6 h-6 text-gray-400" />
        )}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {uploading ? 'Uploading…' : 'Click to add gallery images'}
        </span>
      </button>

      {helperText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
