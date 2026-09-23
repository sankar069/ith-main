import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Modal } from '../ui'
import { Zap, Brain, Sparkles, Code, Lightbulb, Clock, Trophy, Wand2, FlaskConical, CheckCircle2 } from 'lucide-react'

// Tool catalog is static feature config, not per-user data, so it stays.
// Per-user usage counts, credit balances, and waitlist numbers were mock
// values with no backing API — removed rather than faked. The sandbox below
// is an honest UI shell: it collects structured input per persona and shows
// the *shape* of the output it will eventually produce, clearly labeled as
// not yet wired to a real AI backend.
const tools = [
  {
    id: 1,
    name: 'AI Writing Assistant',
    desc: 'Polish your essays, ideas, and project descriptions',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    status: 'active',
    creditsPerUse: 5,
    fields: [
      { key: 'contentType', label: 'Content Type', type: 'select', options: ['Essay', 'Project Description', 'Cover Letter', 'Bio'] },
      { key: 'tone', label: 'Tone', type: 'select', options: ['Formal', 'Casual', 'Persuasive', 'Confident'] },
      { key: 'draft', label: 'Your Draft', type: 'textarea', placeholder: 'Paste the text you want polished…' },
    ],
    outputSections: ['Polished Draft', 'Key Improvements', 'Tone & Clarity Check'],
  },
  {
    id: 2,
    name: 'Resume Optimizer',
    desc: 'Enhance your resume with AI-powered suggestions',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    status: 'active',
    creditsPerUse: 10,
    fields: [
      { key: 'targetRole', label: 'Target Role', type: 'text', placeholder: 'e.g. Frontend Engineer Intern' },
      { key: 'jobDescription', label: 'Job Description (optional)', type: 'textarea', placeholder: 'Paste the job posting for keyword matching…' },
      { key: 'resumeSection', label: 'Resume Content', type: 'textarea', placeholder: 'Paste a section of your resume…' },
    ],
    outputSections: ['ATS Match Score', 'Suggested Edits', 'Missing Keywords'],
  },
  {
    id: 3,
    name: 'Code Reviewer',
    desc: 'Get AI feedback on your code submissions',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    status: 'active',
    creditsPerUse: 8,
    fields: [
      { key: 'language', label: 'Language', type: 'select', options: ['JavaScript', 'Python', 'Java', 'C++', 'Other'] },
      { key: 'focus', label: 'Focus Areas', type: 'checkboxes', options: ['Security', 'Performance', 'Readability', 'Best Practices'] },
      { key: 'code', label: 'Code', type: 'textarea', placeholder: 'Paste your code…', mono: true },
    ],
    outputSections: ['Issues Found', 'Suggestions', 'Overall Rating'],
  },
  {
    id: 4,
    name: 'Idea Generator',
    desc: 'Brainstorm project ideas with AI assistance',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-500',
    status: 'active',
    creditsPerUse: 3,
    fields: [
      { key: 'interests', label: 'Interests / Skills', type: 'text', placeholder: 'e.g. React, computer vision, sustainability' },
      { key: 'problemArea', label: 'Problem Area (optional)', type: 'text', placeholder: 'e.g. campus food waste' },
      { key: 'teamSize', label: 'Team Size', type: 'select', options: ['Solo', '2-3', '4-5', '6+'] },
    ],
    outputSections: ['Idea Shortlist', 'Feasibility Notes', 'Suggested Tech Stack'],
  },
  {
    id: 5,
    name: 'Interview Coach',
    desc: 'Prepare for interviews with AI coaching',
    icon: Brain,
    color: 'from-red-500 to-rose-500',
    status: 'coming-soon',
  },
]

export default function AISuiteTab() {
  const [activeToolId, setActiveToolId] = useState(null)
  const [showWaitlist, setShowWaitlist] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [showPreview, setShowPreview] = useState(false)

  const activeTool = tools.find((t) => t.id === activeToolId) || null

  const setField = (key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))

  const toggleCheckbox = (key, option) => {
    setFormValues((prev) => {
      const current = prev[key] || []
      const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
      return { ...prev, [key]: next }
    })
  }

  const handleToolClick = (tool) => {
    if (tool.status === 'coming-soon') {
      setShowWaitlist(tool)
    } else {
      setActiveToolId(tool.id)
      setFormValues({})
      setShowPreview(false)
    }
  }

  const switchPersona = (id) => {
    setActiveToolId(Number(id))
    setFormValues({})
    setShowPreview(false)
  }

  const hasAnyInput = activeTool?.fields?.some((f) => {
    const v = formValues[f.key]
    return Array.isArray(v) ? v.length > 0 : !!v
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light mb-2">
          🤖 AI Suite & Growth Engine
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Powered by Google Gemini - Accelerate your growth with AI
        </p>
      </div>

      {/* Credit System */}
      <Card className="bg-gradient-to-r from-[#c84c30]/5 to-[#8ab4f8]/5 border-[#c84c30]/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🔋 AI Credits</span>
            <Badge className="bg-[#c84c30] text-white">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Credit balances and usage tracking will appear here once the AI Suite is connected to a real backend.
          </p>
        </CardContent>
      </Card>

      {/* Prompt Engineering Sandbox */}
      {activeTool && (
        <Card className="border-[#c84c30]/30">
          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#c84c30]" /> Prompt Engineering Sandbox
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveToolId(null)}
              >
                ✕ Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Honesty banner */}
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
              <FlaskConical className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                This sandbox is a preview of the tool's interface. It is not yet connected to a live AI backend, so no real output is generated — "Generate" shows the structure your result will follow.
              </p>
            </div>

            {/* Persona Selector */}
            <div>
              <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Persona</label>
              <select
                value={activeTool.id}
                onChange={(e) => switchPersona(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-[#404854] bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light px-3 py-2 text-sm"
              >
                {tools.filter((t) => t.status === 'active').map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activeTool.desc}</p>
            </div>

            {/* Structured Template Fields */}
            <div className="space-y-4">
              {activeTool.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">{field.label}</label>
                  {field.type === 'text' && (
                    <Input
                      className="mt-2"
                      placeholder={field.placeholder}
                      value={formValues[field.key] || ''}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      className={`mt-2 w-full rounded-lg border border-gray-300 dark:border-[#404854] bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light px-3 py-2 text-sm min-h-[100px] ${field.mono ? 'font-mono' : ''}`}
                      placeholder={field.placeholder}
                      value={formValues[field.key] || ''}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      className="mt-2 w-full rounded-lg border border-gray-300 dark:border-[#404854] bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light px-3 py-2 text-sm"
                      value={formValues[field.key] || ''}
                      onChange={(e) => setField(field.key, e.target.value)}
                    >
                      <option value="" disabled>Select…</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'checkboxes' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.options.map((opt) => {
                        const checked = (formValues[field.key] || []).includes(opt)
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => toggleCheckbox(field.key, opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                              checked
                                ? 'bg-[#c84c30] text-white border-[#c84c30]'
                                : 'bg-white dark:bg-[#1a1f26] text-gray-600 dark:text-gray-400 border-gray-300 dark:border-[#404854]'
                            }`}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                💳 {activeTool.creditsPerUse} credits per use
              </p>
              <Button
                variant="primary"
                className="flex items-center gap-2"
                disabled={!hasAnyInput}
                onClick={() => setShowPreview(true)}
              >
                <Wand2 className="w-4 h-4" /> Generate (Preview)
              </Button>
            </div>

            {/* Output Shell Preview */}
            {showPreview && (
              <div className="border border-dashed border-[#c84c30]/40 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output Preview — Not Real AI Output</p>
                {activeTool.outputSections.map((section) => (
                  <div key={section} className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg p-3">
                    <p className="text-sm font-semibold text-cozy-dark dark:text-cozy-light flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-300 dark:text-gray-600" /> {section}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Will appear here once the AI Suite is connected to a live backend.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => {
          const Icon = tool.icon
          return (
            <Card
              key={tool.id}
              className={`hover:shadow-lg transition-all overflow-hidden cursor-pointer ${
                tool.status === 'active' ? 'hover:scale-105' : ''
              }`}
              onClick={() => handleToolClick(tool)}
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {tool.status === 'coming-soon' && (
                    <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      Soon
                    </Badge>
                  )}
                </div>

                <p className="font-semibold text-cozy-dark dark:text-cozy-light mb-1">
                  {tool.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {tool.desc}
                </p>

                {tool.status === 'active' ? (
                  <>
                    <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs">
                      <div className="flex items-center justify-end text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-[#c84c30]">-{tool.creditsPerUse} credits</span>
                      </div>
                    </div>

                    <Button variant="primary" size="sm" className="w-full">
                      Open Tool
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="mb-3 text-xs">
                      <p className="text-gray-600 dark:text-gray-400">Coming soon</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Join Waitlist
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Highlight */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100">
            ✨ Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-800 dark:text-green-100 text-sm space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Unlimited usage with active subscription
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" /> Priority processing and faster responses
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> Early access to new AI tools
          </div>
        </CardContent>
      </Card>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <Modal isOpen={true} onClose={() => setShowWaitlist(null)}>
          <div className="p-6 text-center space-y-4">
            <p className="text-2xl">{showWaitlist.icon ? '🎉' : '📋'}</p>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light">
              {showWaitlist.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {showWaitlist.desc}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📅 This tool is coming soon.
              </p>
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowWaitlist(null)
                }}
              >
                Join Waitlist
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowWaitlist(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
