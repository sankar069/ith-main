import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Input, Button } from '../../ui'

export default function Step1Personal({ formData, errors, onChange }) {
  const [previewImage, setPreviewImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target.result)
        onChange('profileImage', file)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    onChange('profileImage', null)
  }

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center">
        {previewImage ? (
          <div className="relative mb-4">
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#c84c30]"
            />
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        )}

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button variant="secondary" size="sm" as="span">
            Upload Photo
          </Button>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          JPG, PNG up to 5MB
        </p>
      </div>

      {/* Personal Details */}
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          error={errors.fullName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors.email}
          required
          helperText="We'll send verification code to this email"
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          error={errors.phone}
          helperText="Optional - For event notifications"
        />

        <Input
          label="Professional Headline"
          placeholder="e.g., Full-Stack Developer | AI Enthusiast"
          value={formData.headline}
          onChange={(e) => onChange('headline', e.target.value)}
          error={errors.headline}
          required
          helperText="How would you describe your professional identity?"
        />
      </div>
    </div>
  )
}
