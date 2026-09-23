import React, { useEffect, useRef } from 'react'
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Eraser } from 'lucide-react'
import { sanitizeHTML } from '../../../lib/sanitize'

/**
 * Dependency-free WYSIWYG editor using contentEditable + document.execCommand.
 * execCommand is a legacy API, but every browser still supports these basic
 * formatting commands, and avoiding a third-party editor package (Quill,
 * TipTap, Slate...) sidesteps a whole class of version-compatibility risk.
 * Swap in a proper editor library later if richer editing is needed.
 * 
 * SECURITY: All HTML is sanitized to prevent XSS attacks
 */
export default function SimpleRichTextEditor({ value, onChange, minHeight = '260px' }) {
  const editorRef = useRef(null)
  const lastValueRef = useRef(value)

  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      // Sanitize content before rendering to prevent XSS
      const sanitized = sanitizeHTML(value || '', 'richText')
      if (editorRef.current.innerHTML !== sanitized) {
        editorRef.current.innerHTML = sanitized
      }
    }
    lastValueRef.current = value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || ''
    // Sanitize output to prevent malicious content injection
    const sanitized = sanitizeHTML(html, 'richText')
    lastValueRef.current = sanitized
    onChange(sanitized)
  }

  const exec = (command, arg) => {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    handleInput()
  }

  const insertLink = () => {
    const url = window.prompt('Link URL')
    if (url) exec('createLink', url)
  }

  const buttons = [
    { icon: Bold, label: 'Bold', onClick: () => exec('bold') },
    { icon: Italic, label: 'Italic', onClick: () => exec('italic') },
    { icon: Underline, label: 'Underline', onClick: () => exec('underline') },
    { icon: Heading2, label: 'Heading 2', onClick: () => exec('formatBlock', 'H2') },
    { icon: Heading3, label: 'Heading 3', onClick: () => exec('formatBlock', 'H3') },
    { icon: List, label: 'Bullet list', onClick: () => exec('insertUnorderedList') },
    { icon: ListOrdered, label: 'Numbered list', onClick: () => exec('insertOrderedList') },
    { icon: LinkIcon, label: 'Insert link', onClick: insertLink },
    { icon: Eraser, label: 'Clear formatting', onClick: () => { exec('removeFormat'); exec('formatBlock', 'P') } },
  ]

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-[#0f1419] border-b border-gray-200 dark:border-[#404854] flex-wrap">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.onClick}
            title={btn.label}
            aria-label={btn.label}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <btn.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{ minHeight }}
        className="max-w-none p-4 bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light text-sm leading-relaxed focus:outline-none [&_p]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_a]:text-[#c84c30] [&_a]:underline"
      />
    </div>
  )
}
