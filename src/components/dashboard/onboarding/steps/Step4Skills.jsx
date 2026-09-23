import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Input, Badge } from '../../ui'

const allTechnicalSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'SQL',
  'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Science',
  'Vue.js', 'Angular', 'Next.js', 'Express.js', 'Django', 'Flask', 'FastAPI',
  'Git', 'Linux', 'DevOps', 'CI/CD', 'Microservices', 'WebAssembly',
]

const allSoftSkills = [
  'Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Critical Thinking',
  'Creativity', 'Time Management', 'Public Speaking', 'Negotiation', 'Mentoring',
  'Project Management', 'Adaptability', 'Collaboration', 'Presentation', 'Writing',
]

export default function Step4Skills({ formData, onChange }) {
  const [techInput, setTechInput] = useState('')
  const [softInput, setSoftInput] = useState('')
  const [techSuggestions, setTechSuggestions] = useState([])
  const [softSuggestions, setSoftSuggestions] = useState([])

  const handleTechInput = (value) => {
    setTechInput(value)
    if (value.length > 0) {
      const filtered = allTechnicalSkills.filter(
        skill =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !formData.technicalSkills.includes(skill)
      )
      setTechSuggestions(filtered)
    } else {
      setTechSuggestions([])
    }
  }

  const handleSoftInput = (value) => {
    setSoftInput(value)
    if (value.length > 0) {
      const filtered = allSoftSkills.filter(
        skill =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !formData.softSkills.includes(skill)
      )
      setSoftSuggestions(filtered)
    } else {
      setSoftSuggestions([])
    }
  }

  const addTechnicalSkill = (skill) => {
    if (!formData.technicalSkills.includes(skill)) {
      onChange('technicalSkills', [...formData.technicalSkills, skill])
    }
    setTechInput('')
    setTechSuggestions([])
  }

  const addSoftSkill = (skill) => {
    if (!formData.softSkills.includes(skill)) {
      onChange('softSkills', [...formData.softSkills, skill])
    }
    setSoftInput('')
    setSoftSuggestions([])
  }

  const removeTechnicalSkill = (skill) => {
    onChange('technicalSkills', formData.technicalSkills.filter(s => s !== skill))
  }

  const removeSoftSkill = (skill) => {
    onChange('softSkills', formData.softSkills.filter(s => s !== skill))
  }

  return (
    <div className="space-y-6">
      {/* Technical Skills */}
      <div>
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-3">
          Technical Skills
        </label>

        <div className="relative mb-3">
          <Input
            placeholder="Search and add skills (e.g., React, Python)..."
            value={techInput}
            onChange={(e) => handleTechInput(e.target.value)}
          />

          {techSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {techSuggestions.map(skill => (
                <button
                  key={skill}
                  onClick={() => addTechnicalSkill(skill)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.technicalSkills.map(skill => (
            <Badge key={skill} variant="primary" className="flex items-center gap-1.5">
              {skill}
              <button
                onClick={() => removeTechnicalSkill(skill)}
                className="hover:opacity-70"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          ))}
        </div>

        {formData.technicalSkills.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Add at least one technical skill
          </p>
        )}
      </div>

      {/* Soft Skills */}
      <div>
        <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-3">
          Soft Skills & Interests
        </label>

        <div className="relative mb-3">
          <Input
            placeholder="Search and add skills (e.g., Leadership, Communication)..."
            value={softInput}
            onChange={(e) => handleSoftInput(e.target.value)}
          />

          {softSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {softSuggestions.map(skill => (
                <button
                  key={skill}
                  onClick={() => addSoftSkill(skill)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.softSkills.map(skill => (
            <Badge key={skill} variant="success" className="flex items-center gap-1.5">
              {skill}
              <button
                onClick={() => removeSoftSkill(skill)}
                className="hover:opacity-70"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <p className="text-sm text-purple-900 dark:text-purple-100">
          <span className="font-semibold">🎯 Tip:</span> Your skills help us match you with relevant events, mentors, and team opportunities.
        </p>
      </div>
    </div>
  )
}
