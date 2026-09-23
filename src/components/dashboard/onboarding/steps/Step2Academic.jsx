import React from 'react'
import { Input, Select } from '../../ui'

export default function Step2Academic({ formData, errors, onChange }) {
  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 10 }, (_, i) => ({
    label: (currentYear + i).toString(),
    value: currentYear + i,
  }))

  const degrees = [
    { label: 'Bachelor of Technology (B.Tech)', value: 'btech' },
    { label: 'Bachelor of Science (B.Sc)', value: 'bsc' },
    { label: 'Bachelor of Commerce (B.Com)', value: 'bcom' },
    { label: 'Bachelor of Arts (B.A)', value: 'ba' },
    { label: 'Master of Technology (M.Tech)', value: 'mtech' },
    { label: 'Master of Science (M.Sc)', value: 'msc' },
    { label: 'Other', value: 'other' },
  ]

  return (
    <div className="space-y-4">
      <Input
        label="College/University Name"
        placeholder="Enter your college or university name"
        value={formData.university}
        onChange={(e) => onChange('university', e.target.value)}
        error={errors.university}
        required
      />

      <Select
        label="Degree"
        options={degrees}
        value={formData.degree}
        onChange={(e) => onChange('degree', e.target.value)}
        error={errors.degree}
        required
      />

      <Select
        label="Expected Graduation Year"
        options={graduationYears}
        value={formData.graduationYear}
        onChange={(e) => onChange('graduationYear', parseInt(e.target.value))}
        error={errors.graduationYear}
        required
      />

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <span className="font-semibold">💡 Tip:</span> Your academic details help us recommend personalized events and opportunities aligned with your study path.
        </p>
      </div>
    </div>
  )
}
