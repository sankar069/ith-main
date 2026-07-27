import { create } from 'zustand'

export const useAppStore = create((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  openModals: [], // array of modal IDs
  openModal: (modalId) => set((state) => {
    if (!state.openModals.includes(modalId)) {
      return { openModals: [...state.openModals, modalId] }
    }
    return state
  }),
  closeModal: (modalId) => set((state) => ({
    openModals: state.openModals.filter(id => id !== modalId)
  })),
  closeAllModals: () => set({ openModals: [] })
}))
