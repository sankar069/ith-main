import React, { useState } from 'react'
import { Edit2, X, Code, Share2, Globe, Plus, Trash2 } from 'lucide-react'

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [autoSync, setAutoSync] = useState(true)

  const [profile] = useState({
    firstName: 'Satyam',
    lastName: 'Kumar',
    headline: 'Full-Stack Developer | 2x Hackathon Winner',
    university: 'IIT Delhi',
    degree: 'B.Tech CSE',
    year: '3rd Year',
    email: 'satyam@example.com',
    phone: '+91 98765 43210',
    location: 'Delhi, India',
    college: 'Indian Institute of Technology Delhi',
    major: 'Computer Science & Engineering',
    cgpa: '8.2',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'],
    softSkills: ['Leadership', 'Communication', 'Problem Solving'],
    github: 'github.com/satyam',
    linkedin: 'linkedin.com/in/satyam',
    portfolio: 'satyam.dev',
  })

  return (
    <div className="p-6 space-y-8 bg-cozy-light dark:bg-cozy-dark">{/* Flat background */}
      
      {/* Header Section */}
      <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-full bg-[#c84c30] flex items-center justify-center flex-shrink-0">{/* Solid color */}
              <span className="text-white text-4xl font-bold">SK</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-serif font-bold text-cozy-dark dark:text-white">
                  {profile.firstName} {profile.lastName}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-2">{profile.headline}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#c84c30]/10 text-[#c84c30] text-sm font-semibold rounded-full">
                  {profile.university}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                  {profile.year}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 bg-[#c84c30] text-white hover:bg-[#b84027]"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Auto-Sync Toggle */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => setAutoSync(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Auto-Sync Profile with Event Registrations
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">(Auto-fill forms with profile data)</span>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Basic Info */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-white mb-4">Basic Info</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Email</label>
              <p className="text-sm text-gray-700 dark:text-gray-300">{profile.email}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Phone</label>
              <p className="text-sm text-gray-700 dark:text-gray-300">{profile.phone}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Location</label>
              <p className="text-sm text-gray-700 dark:text-gray-300">{profile.location}</p>
            </div>
          </div>
        </div>

        {/* Academics */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-white mb-4">Academics</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">College</label>
              <p className="text-sm text-gray-700 dark:text-gray-300">{profile.college}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Major</label>
              <p className="text-sm text-gray-700 dark:text-gray-300">{profile.major}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">CGPA</label>
              <p className="text-sm font-bold text-[#c84c30]">{profile.cgpa} / 10.0</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-white mb-4">Links</h3>
          <div className="space-y-3">
            <a href="#" className="flex items-center gap-2 text-sm text-[#8ab4f8] hover:underline">
              <Code className="w-4 h-4" /> GitHub Profile
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-[#8ab4f8] hover:underline">
              <Share2 className="w-4 h-4" /> LinkedIn Profile
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-[#8ab4f8] hover:underline">
              <Globe className="w-4 h-4" /> Portfolio
            </a>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Skills */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-white mb-4 flex items-center justify-between">
            <span>Core Tech Stack</span>
            {isEditing && <Plus className="w-5 h-5 text-[#c84c30] cursor-pointer hover:scale-110 transition" />}
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <div
                key={idx}
                className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-lg flex items-center gap-2"
              >
                {skill}
                {isEditing && <Trash2 className="w-3 h-3 cursor-pointer hover:text-red-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-white mb-4 flex items-center justify-between">
            <span>Soft Skills</span>
            {isEditing && <Plus className="w-5 h-5 text-[#c84c30] cursor-pointer hover:scale-110 transition" />}
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.softSkills.map((skill, idx) => (
              <div
                key={idx}
                className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-lg flex items-center gap-2"
              >
                {skill}
                {isEditing && <Trash2 className="w-3 h-3 cursor-pointer hover:text-red-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience/Projects Section */}
      <div className="bg-white dark:bg-[#1a1f26] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-serif font-bold text-cozy-dark dark:text-white mb-4 flex items-center justify-between">
          <span>Experience & Projects</span>
          {isEditing && <Plus className="w-5 h-5 text-[#c84c30] cursor-pointer hover:scale-110 transition" />}
        </h3>

        <div className="space-y-4">
          {[
            { title: 'Full-Stack Developer Intern', company: 'TechCorp', period: 'Jun 2023 - Aug 2023' },
            { title: 'President, Coding Club', company: 'IIT Delhi', period: 'Jan 2023 - Present' },
            { title: 'AI Chatbot SaaS', company: 'Personal Project', period: 'Built & Deployed' },
          ].map((exp, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg flex items-start justify-between group hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{exp.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{exp.period}</p>
              </div>
              {isEditing && <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 cursor-pointer transition" />}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
