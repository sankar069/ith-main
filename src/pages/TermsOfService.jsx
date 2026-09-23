import React, { useEffect, useState } from 'react'
import { createSafeHTML } from '../lib/sanitize'

export default function TermsOfService() {
  const [content, setContent] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    fetch('/api/legal/terms-conditions')
      .then((r) => r.json())
      .then((data) => {
        setContent(data.page?.content_html || '')
        setUpdatedAt(data.page?.updated_at || null)
      })
      .catch(() => setContent(''))
  }, [])

  return (
    <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark py-20 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <a href="/" className="flex items-center gap-2 font-bold text-lg hover:text-[#c84c30] transition-colors">
            <div className="w-10 h-10 rounded bg-[#c84c30] flex items-center justify-center">
              <span className="text-white font-bold">IH</span>
            </div>
            <span>InnoTech-Hub</span>
          </a>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-cozy-dark dark:text-cozy-light mb-4">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {updatedAt ? `Last updated: ${new Date(updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
          </p>
        </div>

        {/* Content — SECURITY: Sanitized with DOMPurify to prevent XSS */}
        <div
          className="bg-white dark:bg-[#1a1f26] rounded-lg border border-gray-200 dark:border-[#404854] p-8 space-y-6
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-cozy-dark [&_h2]:dark:text-cozy-light [&_h2]:mb-3
            [&_h3]:font-semibold [&_h3]:text-cozy-dark [&_h3]:dark:text-cozy-light
            [&_p]:text-gray-700 [&_p]:dark:text-gray-300 [&_p]:leading-relaxed
            [&_ul]:space-y-2 [&_ul]:ml-4 [&_ul]:text-gray-700 [&_ul]:dark:text-gray-300 [&_ul]:list-disc [&_ul]:list-inside"
          dangerouslySetInnerHTML={createSafeHTML(content || '<p>Loading…</p>', 'richText')}
        />

        {/* Back Link */}
        <div className="mt-8">
          <a href="/" className="text-[#c84c30] hover:text-[#a83820] font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
