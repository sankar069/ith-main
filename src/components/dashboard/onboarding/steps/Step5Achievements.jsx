import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input, Button } from '../../ui'

const hackathonRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'AI/ML Engineer',
  'Data Scientist',
  'UI/UX Designer',
  'Product Manager',
  'Team Lead',
  'DevOps Engineer',
]

export default function Step5Achievements({ formData, onChange }) {
  const [newAchievement, setNewAchievement] = useState('')

  const addAchievement = () => {
    if (newAchievement.trim()) {
      onChange('achievements', [...formData.achievements, newAchievement])
      setNewAchievement('')
    }
  }

  const removeAchievement = (index) => {
    onChange('achievements', formData.achievements.filter((_, i) => i !== index))
  }

  const toggleRole = (role) => {
    if (formData.preferredRoles.includes(role)) {
      onChange('preferredRoles', formData.preferredRoles.filter(r => r !== role))
    } else {
      onChange('preferredRoles', [...formData.preferredRoles, role])
    }
  }

  return (
    <div className="space-y-6">
      {/* Achievements */}
      <div>
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-3">
          Key Achievements & Awards
        </label>

        <div className="flex gap-2 mb-3">
          <Input
            placeholder="e.g., Winner - National Hackathon 2024"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addAchievement()
              }
            }}
          />
          <Button
            variant="primary"
            onClick={addAchievement}
            disabled={!newAchievement.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {formData.achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-between"
            >
              <span className="text-sm text-cozy-dark dark:text-cozy-light">{achievement}</span>
              <button
                onClick={() => removeAchievement(index)}
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {formData.achievements.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            No achievements added yet
          </p>
        )}
      </div>

      {/* Preferred Hackathon Roles */}
      <div>
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-3">
          Preferred Hackathon Roles
        </label>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Select roles you'd prefer in hackathon teams
        </p>

        <div className="flex flex-wrap gap-2">
          {hackathonRoles.map(role => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                formData.preferredRoles.includes(role)
                  ? 'border-[#c84c30] bg-[#c84c30]/10 text-[#c84c30]'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-[#c84c30]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {formData.preferredRoles.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Select at least one role
          </p>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-900 dark:text-yellow-100">
          <span className="font-semibold">⭐ Optional:</span> Your achievements and role preferences help organizers build the perfect teams for you.
        </p>
      </div>
    </div>
  )
}
