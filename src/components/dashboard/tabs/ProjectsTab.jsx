import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, Button, Badge, Input, Textarea, Modal, Skeleton } from '../ui'
import { Code2, GitBranch, ExternalLink, Plus, FolderOpen, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { studentFetch, StudentApiError } from '../../../lib/studentApi'
import { XP_RULES } from '../../../lib/xp'

const STAGES = [
  { key: 'ideation', label: 'Ideation' },
  { key: 'team_formation', label: 'Team Formation' },
  { key: 'github_linked', label: 'GitHub Linkage' },
  { key: 'submitted', label: 'Final Submission' },
]

const STAGE_BADGE = {
  ideation: { variant: 'secondary', label: 'Ideation' },
  team_formation: { variant: 'info', label: 'Team Formation' },
  github_linked: { variant: 'warning', label: 'GitHub Linked' },
  submitted: { variant: 'success', label: 'Submitted' },
}

function stageIndex(stage) {
  return STAGES.findIndex((s) => s.key === stage)
}

export default function ProjectsTab() {
  const { addNotification } = useDashboard()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [savingNew, setSavingNew] = useState(false)

  const [wizardProject, setWizardProject] = useState(null)
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardForm, setWizardForm] = useState({ title: '', description: '', team_members: '', github_url: '', live_url: '', skills: '' })
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await studentFetch('/api/student/projects')
      setProjects(data.projects || [])
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to load projects.', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      addNotification('Project title is required.', 'error')
      return
    }
    setSavingNew(true)
    try {
      const data = await studentFetch('/api/student/projects', {
        method: 'POST',
        body: { title: newTitle.trim(), description: newDesc },
      })
      setProjects((prev) => [data.project, ...prev])
      addNotification('Project created — let\'s build it out!', 'success')
      setCreating(false)
      setNewTitle('')
      setNewDesc('')
      openWizard(data.project)
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to create project.', 'error')
    } finally {
      setSavingNew(false)
    }
  }

  const openWizard = (project) => {
    setWizardProject(project)
    setWizardStep(Math.max(0, stageIndex(project.stage)))
    setWizardForm({
      title: project.title || '',
      description: project.description || '',
      team_members: (project.team_members || []).join(', '),
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      skills: (project.skills || []).join(', '),
    })
  }

  const closeWizard = () => {
    setWizardProject(null)
    setWizardStep(0)
  }

  const persistStage = async (targetStage, extraFields = {}) => {
    setSaving(true)
    try {
      const data = await studentFetch(`/api/student/projects/${wizardProject.id}`, {
        method: 'PUT',
        body: { stage: targetStage, ...extraFields },
      })
      setProjects((prev) => prev.map((p) => (p.id === data.project.id ? data.project : p)))
      setWizardProject(data.project)
      return data.project
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to save.', 'error')
      return null
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    const step = STAGES[wizardStep]
    let extraFields = {}
    if (step.key === 'ideation') {
      if (!wizardForm.title.trim()) {
        addNotification('Project title is required.', 'error')
        return
      }
      extraFields = { title: wizardForm.title.trim(), description: wizardForm.description }
    } else if (step.key === 'team_formation') {
      extraFields = { team_members: wizardForm.team_members.split(',').map((s) => s.trim()).filter(Boolean) }
    } else if (step.key === 'github_linked') {
      extraFields = { github_url: wizardForm.github_url || null, live_url: wizardForm.live_url || null }
    }

    const nextStageIdx = Math.min(wizardStep + 1, STAGES.length - 1)
    const nextStage = STAGES[nextStageIdx].key

    if (wizardStep === STAGES.length - 1) {
      // Final step — submit for real.
      extraFields = { skills: wizardForm.skills.split(',').map((s) => s.trim()).filter(Boolean) }
      const updated = await persistStage('submitted', extraFields)
      if (updated) {
        addNotification(`🎉 "${updated.title}" submitted!`, 'success')
        setTimeout(() => addNotification(`⚡ +${XP_RULES.project_submitted} XP earned!`, 'success'), 400)
        closeWizard()
      }
      return
    }

    const updated = await persistStage(nextStage, extraFields)
    if (updated) setWizardStep(nextStageIdx)
  }

  const handleBack = () => setWizardStep((s) => Math.max(0, s - 1))

  const handleDelete = async (id) => {
    try {
      await studentFetch(`/api/student/projects/${id}`, { method: 'DELETE' })
      setProjects((prev) => prev.filter((p) => p.id !== id))
      addNotification('Project deleted.', 'success')
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to delete project.', 'error')
    } finally {
      setConfirmDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light">My Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Take an idea through to a real submission</p>
        </div>
        <Button variant="primary" size="lg" className="flex items-center gap-2" onClick={() => setCreating(true)}>
          <Plus className="w-5 h-5" /> New Project
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height="180px" count={2} />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center flex flex-col items-center gap-2">
            <FolderOpen className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400">
              No projects yet. Add your first project to start building your portfolio.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const cfg = STAGE_BADGE[project.stage] || STAGE_BADGE.ideation
            return (
              <Card key={project.id} className="hover:shadow-lg transition-all relative cursor-pointer" onClick={() => openWizard(project)}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-cozy-dark dark:text-cozy-light truncate">{project.title}</h3>
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(confirmDeleteId === project.id ? null : project.id) }}
                      className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>

                  {confirmDeleteId === project.id && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-red-700 dark:text-red-300">Delete this project?</span>
                      <div className="flex gap-1">
                        <button onClick={() => setConfirmDeleteId(null)} className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600">Cancel</button>
                        <button onClick={() => handleDelete(project.id)} className="text-xs px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                      </div>
                    </div>
                  )}

                  {project.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{project.description}</p>}

                  {project.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-semibold text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900">
                        <GitBranch className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-semibold text-cozy-dark dark:text-cozy-light hover:bg-gray-50 dark:hover:bg-gray-900">
                        <ExternalLink className="w-4 h-4" /> Live
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* New Project Modal */}
      <Modal isOpen={creating} onClose={() => setCreating(false)} title="Start a New Project">
        <div className="space-y-4">
          <Input label="Project Title" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Smart Attendance App" />
          <Textarea label="Description" rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What's the idea?" />
          <Button variant="primary" className="w-full" onClick={handleCreate} disabled={savingNew}>
            {savingNew ? 'Creating…' : 'Create & Continue'}
          </Button>
        </div>
      </Modal>

      {/* 4-Stage Wizard */}
      <Modal isOpen={!!wizardProject} onClose={closeWizard} title={wizardProject?.title || 'Project'} size="lg">
        {wizardProject && (
          <div className="space-y-6">
            {/* Stepper */}
            <div className="flex items-center">
              {STAGES.map((s, i) => (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i < wizardStep ? 'bg-green-500 text-white' : i === wizardStep ? 'bg-[#c84c30] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {i < wizardStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center w-16">{s.label}</span>
                  </div>
                  {i < STAGES.length - 1 && <div className={`flex-1 h-0.5 mb-4 ${i < wizardStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                </React.Fragment>
              ))}
            </div>

            {/* Step content */}
            {STAGES[wizardStep].key === 'ideation' && (
              <div className="space-y-4">
                <Input label="Project Title" required value={wizardForm.title} onChange={(e) => setWizardForm((f) => ({ ...f, title: e.target.value }))} />
                <Textarea label="Description" rows={4} value={wizardForm.description} onChange={(e) => setWizardForm((f) => ({ ...f, description: e.target.value }))} placeholder="What problem does this solve? What's your approach?" />
              </div>
            )}

            {STAGES[wizardStep].key === 'team_formation' && (
              <div className="space-y-4">
                <Input
                  label="Team Members" helperText="Comma-separated names or emails. Leave blank if working solo."
                  value={wizardForm.team_members} onChange={(e) => setWizardForm((f) => ({ ...f, team_members: e.target.value }))}
                  placeholder="e.g. Priya Nair, Rohit Menon"
                />
              </div>
            )}

            {STAGES[wizardStep].key === 'github_linked' && (
              <div className="space-y-4">
                <Input label="GitHub Repository URL" value={wizardForm.github_url} onChange={(e) => setWizardForm((f) => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/you/project" />
                <Input label="Live Demo URL (Optional)" value={wizardForm.live_url} onChange={(e) => setWizardForm((f) => ({ ...f, live_url: e.target.value }))} placeholder="https://your-demo.vercel.app" />
              </div>
            )}

            {STAGES[wizardStep].key === 'submitted' && (
              <div className="space-y-4">
                <Input
                  label="Skills Used" helperText="Comma-separated — these show up on your public profile's skill cloud."
                  value={wizardForm.skills} onChange={(e) => setWizardForm((f) => ({ ...f, skills: e.target.value }))}
                  placeholder="e.g. React, Supabase, Figma"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready to submit? This locks in your project as complete.</p>
              </div>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-[#404854]">
              <button
                onClick={handleBack}
                disabled={wizardStep === 0 || saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-cozy-dark dark:text-cozy-light disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <Button variant="primary" onClick={handleNext} disabled={saving} className="flex items-center gap-2">
                {saving ? 'Saving…' : STAGES[wizardStep].key === 'submitted' ? 'Submit Project' : 'Next'}
                {!saving && STAGES[wizardStep].key !== 'submitted' && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
