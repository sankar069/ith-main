import { create } from 'zustand'

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const useAppStore = create((set) => ({
  isDarkMode: localStorage.getItem('isDarkMode') === 'true',
  toggleDarkMode: () => set((state) => {
    const newState = !state.isDarkMode
    localStorage.setItem('isDarkMode', newState)
    return { isDarkMode: newState }
  }),
  
  // Prefills the contact form's "query type" dropdown when navigated to
  // from a CTA like "Become a Partner" or "Sponsor an Event".
  contactIntent: '',
  setContactIntent: (intent) => set({ contactIntent: intent }),

  openModals: [],
  openModal: (modalId) => set((state) => {
    if (!state.openModals.includes(modalId)) {
      return { openModals: [...state.openModals, modalId] }
    }
    return state
  }),
  closeModal: (modalId) => set((state) => ({
    openModals: state.openModals.filter(id => id !== modalId)
  })),
  closeAllModals: () => set({ openModals: [] }),

  // Auth state
  user: getInitialUser(),
  isLoggedIn: getInitialUser() !== null,

  // Site-wide "am I logged in" flag, used by gating components (EventsGate)
  // and kept in sync by useStudentStore on real login/logout.
  setLoggedIn: (value) => set({ isLoggedIn: value }),

  login: (credentials) => {
    // Mock login - in production, this would call an API
    const mockUser = {
      id: 1,
      name: credentials.email.split('@')[0] === 'admin' ? 'John Doe' : 'Jane Student',
      email: credentials.email,
      avatar: credentials.email.split('@')[0] === 'admin' ? 'JD' : 'JS',
      role: credentials.email.split('@')[0] === 'admin' ? 'admin' : 'student',
      joinDate: new Date().toISOString(),
    }
    localStorage.setItem('user', JSON.stringify(mockUser))
    set({ user: mockUser, isLoggedIn: true })
    return true
  },
  
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    set({ user: null, isLoggedIn: false })
  },
}))


