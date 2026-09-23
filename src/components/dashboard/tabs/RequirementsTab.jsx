import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../ui'
import { FileText, ChevronRight, Clock, CheckCircle, AlertCircle, Download, Bookmark, Search } from 'lucide-react'

export default function RequirementsTab() {
  const [expandedId, setExpandedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [savedDocs, setSavedDocs] = useState([])
  const [deadlineEvents, setDeadlineEvents] = useState([])

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        const now = Date.now()
        const upcoming = (data.events || [])
          .filter((e) => e.registration_deadline && new Date(e.registration_deadline).getTime() > now)
          .sort((a, b) => new Date(a.registration_deadline) - new Date(b.registration_deadline))
        setDeadlineEvents(upcoming)
      })
      .catch(() => {})
  }, [])

  const rulebooks = [
    {
      id: 1,
      title: 'Innovation Passport Guidelines',
      category: 'System',
      description: 'Learn about the Innovation Passport system, how it works, and how to maximize your growth',
      updated: '2 days ago',
      readTime: '8 min',
      sections: [
        {
          title: 'What is the Innovation Passport?',
          content: 'The Innovation Passport is a comprehensive tracking system that monitors your growth, achievements, and learning journey. It records events attended, certificates earned, projects built, and skills mastered.',
        },
        {
          title: 'How Points Work',
          content: 'Earn points by participating in events (10-50 pts), completing courses (20-100 pts), winning competitions (50-500 pts), and building projects (30-150 pts). Use points to unlock premium AI tools and features.',
        },
        {
          title: 'Achievements & Badges',
          content: 'Unlock special badges and achievements by hitting milestones: 5-Event Champion, 10-Skill Master, 3-Time Winner, etc. Badges boost your profile visibility.',
        },
        {
          title: 'Compliance & Verification',
          content: 'All achievements are verified by event organizers and certified partners. Only verified achievements appear on your passport.',
        },
      ],
      icon: '📖',
    },
    {
      id: 2,
      title: 'Hackathon Rules & Regulations',
      category: 'Competition',
      description: 'Official rules for participating in InnoTech-Hub hackathons',
      updated: '1 week ago',
      readTime: '12 min',
      sections: [
        {
          title: 'Eligibility Criteria',
          content: 'Open to all students and professionals. Age restriction: 18+. Must have a valid ID proof.',
        },
        {
          title: 'Team Formation',
          content: 'Teams can have 2-5 members. Solo participation allowed. Team name must be unique and appropriate.',
        },
        {
          title: 'Submission Requirements',
          content: 'Submit project code on GitHub, include README with setup instructions, demo video (max 5 min), and technical documentation.',
        },
        {
          title: 'Judging Criteria',
          content: 'Innovation (25%), Code Quality (25%), Presentation (20%), Feasibility (15%), Usefulness (15%)',
        },
        {
          title: 'Code of Conduct',
          content: 'No plagiarism, harassment, or cheating. Respect intellectual property. Ensure accessibility compliance.',
        },
      ],
      icon: '🏆',
    },
    {
      id: 3,
      title: 'Event Submission Requirements',
      category: 'Submission',
      description: 'Guidelines for submitting projects, ideas, and work for evaluation',
      updated: '3 days ago',
      readTime: '6 min',
      sections: [
        {
          title: 'Project Submission',
          content: 'Submit via GitHub or uploaded files. Max file size: 500MB. Include source code, documentation, and screenshots.',
        },
        {
          title: 'Documentation',
          content: 'Provide clear README, API documentation, deployment instructions, and known limitations.',
        },
        {
          title: 'Demo & Presentation',
          content: 'Record a 3-5 minute demo video. Show key features. Include technical walkthrough.',
        },
        {
          title: 'Deadline & Late Submission',
          content: 'Hard deadline: 11:59 PM on event date. Late submissions will be automatically rejected.',
        },
      ],
      icon: '📝',
    },
    {
      id: 4,
      title: 'Certification Criteria',
      category: 'Certification',
      description: 'Requirements for earning certificates and digital credentials',
      updated: '5 days ago',
      readTime: '10 min',
      sections: [
        {
          title: 'Certificate Types',
          content: 'Participation (attendance ≥80%), Merit (top 25%), Excellence (top 10%), Winner (1st place), and Special Recognition.',
        },
        {
          title: 'Eligibility',
          content: 'Must register before deadline, attend ≥80% of sessions/hackathon duration, and not violate code of conduct.',
        },
        {
          title: 'Blockchain Verification',
          content: 'All certificates include blockchain hash for verification. Easily sharable on LinkedIn and portfolios.',
        },
        {
          title: 'Certificate Validity',
          content: 'Certificates are valid indefinitely. They reflect your achievement at the time of earning.',
        },
      ],
      icon: '📜',
    },
  ]

  // Deadlines are real, derived from published events' registration_deadline.
  // Compliance checklist has no backing data source yet — left empty rather
  // than faked.
  const importantDeadlines = deadlineEvents.map((e) => {
    const daysLeft = Math.ceil((new Date(e.registration_deadline).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    return {
      event: e.name,
      deadline: e.registration_deadline,
      daysLeft,
      status: daysLeft <= 3 ? 'urgent' : 'normal',
    }
  })
  const complianceChecklist = []

  const filteredRulebooks = rulebooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSave = (id) => {
    setSavedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light mb-2">
          📋 Requirements & Guidelines
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Rulebooks, submission criteria, and compliance guidelines
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Rulebooks</p>
                <p className="text-3xl font-bold text-[#c84c30] mt-1">{rulebooks.length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Score</p>
                <p className="text-3xl font-bold text-[#8ab4f8] mt-1">
                  {complianceChecklist.length === 0
                    ? '—'
                    : `${Math.round((complianceChecklist.filter(c => c.completed).length / complianceChecklist.length) * 100)}%`}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Urgent Deadlines</p>
                <p className="text-3xl font-bold text-red-500 mt-1">
                  {importantDeadlines.filter(d => d.status === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Deadlines */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Clock className="w-5 h-5" />
            Important Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {importantDeadlines.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming deadlines right now.</p>
          ) : (
          <div className="space-y-2">
            {importantDeadlines.map((item, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  item.status === 'urgent'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <div>
                  <p className="font-semibold text-cozy-dark dark:text-cozy-light">
                    {item.event}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(item.deadline).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={
                    item.status === 'urgent'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  }
                >
                  {item.daysLeft} days
                </Badge>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search rulebooks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-[#404854] bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c84c30]"
        />
      </div>

      {/* Rulebooks List */}
      <div className="space-y-3">
        {filteredRulebooks.map(book => (
          <Card
            key={book.id}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setExpandedId(expandedId === book.id ? null : book.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">{book.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-cozy-dark dark:text-cozy-light text-lg">
                          {book.title}
                        </h3>
                        <Badge variant="secondary" size="sm">
                          {book.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {book.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedId === book.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>Updated {book.updated}</span>
                    <span>•</span>
                    <span>{book.readTime} read</span>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === book.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#404854] space-y-4">
                      {book.sections.map((section, i) => (
                        <div key={i}>
                          <h4 className="font-semibold text-cozy-dark dark:text-cozy-light mb-2">
                            {section.title}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      ))}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="primary" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" /> Download PDF
                        </Button>
                        <Button
                          variant={savedDocs.includes(book.id) ? 'primary' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSave(book.id)
                          }}
                          className="flex items-center gap-2"
                        >
                          <Bookmark className="w-4 h-4" />
                          {savedDocs.includes(book.id) ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Checklist */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            ✓ Your Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {complianceChecklist.length === 0 ? (
            <p className="text-sm text-blue-800/70 dark:text-blue-200/70">
              No compliance items to show yet.
            </p>
          ) : (
          <div className="space-y-3">
            {complianceChecklist.map((check, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                    check.completed
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  {check.completed && <span className="text-white text-sm">✓</span>}
                </div>
                <p
                  className={`text-sm ${
                    check.completed
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {check.item}
                </p>
              </div>
            ))}
          </div>
          )}
          {complianceChecklist.filter(c => !c.completed).length > 0 && (
            <Button variant="outline" size="sm" className="w-full mt-4">
              Complete Remaining ({complianceChecklist.filter(c => !c.completed).length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Tip */}
      <Card>
        <CardContent className="p-4 flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-cozy-dark dark:text-cozy-light">Pro Tip</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Read the complete rulebooks before submitting your work. Many rejections happen due to not following guidelines.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
