import React, { useEffect } from 'react'
import Home from './pages/Home'
import { useAppStore } from './store/useAppStore'

function App() {
  const { isDarkMode } = useAppStore()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="w-full min-h-screen">
      <div className="animate-fade-in">
        <Home />
      </div>
    </div>
  )
}

export default App
