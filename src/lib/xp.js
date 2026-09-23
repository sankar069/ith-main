// Simple, fully-computed XP/Level system — no stored counter, no schema
// changes. Total XP is always derived fresh from real counts, so it can
// never drift out of sync with what the student has actually done.

export const XP_RULES = {
  registration: 20,
  certificate: 50,
  project_submitted: 30,
}

const XP_PER_LEVEL = 100

export function computeXp({ registrations = 0, certificates = 0, projectsSubmitted = 0 } = {}) {
  return (
    registrations * XP_RULES.registration +
    certificates * XP_RULES.certificate +
    projectsSubmitted * XP_RULES.project_submitted
  )
}

/**
 * Returns { level, xp, xpIntoLevel, xpForNextLevel, progressPct, xpToNextLevel }.
 * Level 1 starts at 0 XP; every XP_PER_LEVEL points is one level.
 */
export function getLevelInfo(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpIntoLevel = xp % XP_PER_LEVEL
  const xpToNextLevel = XP_PER_LEVEL - xpIntoLevel
  return {
    level,
    xp,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    progressPct: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
    xpToNextLevel,
  }
}

export function nextMilestoneText(xpToNextLevel) {
  const events = Math.ceil(xpToNextLevel / XP_RULES.registration)
  return `${xpToNextLevel} XP to your next level — that's ${events} more event registration${events !== 1 ? 's' : ''}, or a mix of certificates and project submissions.`
}
