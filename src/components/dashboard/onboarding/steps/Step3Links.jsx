import React, { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { Input } from '../../ui'

export default function Step3Links({ formData, errors, onChange }) {
  const [resumePreview, setResumePreview] = useState(null)

  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(file.type)) {
        alert('Only PDF and DOC files are supported')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      setResumePreview({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      })
      onChange('resume', file)
    }
  }

  const removeResume = () => {
    setResumePreview(null)
    onChange('resume', null)
  }

  return (
    <div className="space-y-6">
      {/* Links */}
      <div className="space-y-4">
        <Input
          label="GitHub Profile"
          type="url"
          placeholder="https://github.com/username"
          value={formData.github}
          onChange={(e) => onChange('github', e.target.value)}
          helperText="Link to your GitHub profile"
        />

        <Input
          label="Portfolio Website"
          type="url"
          placeholder="https://yourportfolio.com"
          value={formData.portfolio}
          onChange={(e) => onChange('portfolio', e.target.value)}
          helperText="Personal portfolio or website URL"
        />

        <Input
          label="LinkedIn Profile"
          type="url"
          placeholder="https://linkedin.com/in/username"
          value={formData.linkedIn}
          onChange={(e) => onChange('linkedIn', e.target.value)}
          helperText="Link to your LinkedIn profile (optional)"
        />

        {errors.links && (
          <p className="text-xs text-red-500 font-medium">{errors.links}</p>
        )}
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-3">
          Resume (.PDF or .DOC)
        </label>

        {resumePreview ? (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-sm text-cozy-dark dark:text-cozy-light">
                  {resumePreview.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {resumePreview.size} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeResume}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-[#c84c30] transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-cozy-dark dark:text-cozy-light">
              Click to upload resume
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PDF or DOC, max 10MB
            </p>
          </label>
        )}
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-900 dark:text-green-100">
          <span className="font-semibold">✓ All optional:</span> Add links and resume to make your profile stand out to recruiters and event organizers.
        </p>
      </div>
    </div>
  )
}
