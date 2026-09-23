import { create } from 'zustand'
import { useAppStore } from './useAppStore'

const TOKEN_KEY = 'ith_student_token'
const PROFILE_KEY = 'ith_student_profile'

const readStoredProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useStudentStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY) || null,
  profile: readStoredProfile(),

  isAuthenticated: () => !!get().token,

  login: (token, profile) => {
    localStorage.setItem(TOKEN_KEY, token)
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    set({ token, profile: profile || get().profile })
    // Keep the legacy site-wide flag in sync — EventsGate and other
    // components gate content on useAppStore.isLoggedIn.
    useAppStore.getState().setLoggedIn(true)
  },

  setProfile: (profile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    set({ profile })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(PROFILE_KEY)
    set({ token: null, profile: null })
    useAppStore.getState().setLoggedIn(false)
  },
}))
