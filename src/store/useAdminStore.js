import { create } from 'zustand'

const TOKEN_KEY = 'ith_admin_token'
const ADMIN_KEY = 'ith_admin_profile'

const readStoredAdmin = () => {
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAdminStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY) || null,
  admin: readStoredAdmin(),
  // 'idle' | 'checking' | 'ready' — used by AdminProtectedRoute to avoid a
  // flash of the login screen while the stored token is being verified.
  sessionStatus: 'idle',

  isAuthenticated: () => !!get().token,
  isSuperAdmin: () => get().admin?.role === 'super_admin',

  login: (token, admin) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
    set({ token, admin, sessionStatus: 'ready' })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ADMIN_KEY)
    set({ token: null, admin: null, sessionStatus: 'ready' })
  },

  setSessionStatus: (sessionStatus) => set({ sessionStatus }),
}))
