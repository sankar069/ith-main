import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'AI Suite', id: 'ai-suite' },
  { name: 'SaaS', id: 'saas' },
  { name: 'Events', id: 'events' },
  { name: 'Team', id: 'team' },
  { name: 'Roadmap', id: 'roadmap' },
  { name: 'Partners', id: 'partners' },
  { name: 'Contact', id: 'contact' },
]

export default function NavigationBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isSubPage = location.pathname !== '/'
  const { openModal, isDarkMode, toggleDarkMode } = useAppStore()

  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isSolid = isSubPage || isScrolled

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSubPage) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_ITEMS[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSubPage, location.pathname])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const goToSection = (id) => {
    setMobileMenuOpen(false)
    if (isSubPage) {
      navigate(`/#${id}`)
      return
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goHome = () => {
    setMobileMenuOpen(false)
    if (isSubPage) {
      navigate('/')
      return
    }
    goToSection('home')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSolid
            ? 'bg-white/95 dark:bg-cozy-dark/95 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isSolid ? 'h-16' : 'h-[4.5rem] pt-3'}`}>
            {/* Logo */}
            <button
              type="button"
              onClick={goHome}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="w-9 h-9 overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-[#0d213b] shadow-sm">
                <img src="/ith-logo.jpg" alt="InnoTech Hub" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="font-serif font-bold text-base text-cozy-dark dark:text-cozy-light tracking-wide hidden sm:block group-hover:text-[#c84c30] transition-colors">
                InnoTech Hub
              </span>
            </button>

            {/* Desktop nav — scrollable strip for many links */}
            <nav className="hidden lg:flex flex-1 items-center justify-center min-w-0 mx-2">
              <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none max-w-full px-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className={`relative shrink-0 px-3 py-1.5 rounded-full text-[13px] font-sans font-medium whitespace-nowrap transition-colors ${
                      !isSubPage && activeSection === item.id
                        ? 'text-[#c84c30] dark:text-white'
                        : 'text-gray-600 hover:text-cozy-dark dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    {!isSubPage && activeSection === item.id && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.name}
                  </button>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
                className="p-2 rounded-full border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-black/30 hover:scale-105 active:scale-95 transition-transform"
              >
                {isDarkMode ? (
                  <Sun className="w-[18px] h-[18px] text-cozy-light" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-cozy-dark" />
                )}
              </button>

              <button
                type="button"
                onClick={() => openModal('join')}
                className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-sans font-semibold bg-[#c84c30] hover:bg-[#b04027] text-white transition-colors shadow-sm"
              >
                Join Us
              </button>

              <button
                type="button"
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-cozy-dark dark:text-cozy-light"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[4.5rem] left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-white dark:bg-cozy-dark rounded-2xl border border-gray-200 dark:border-white/10 p-3 flex flex-col gap-1 shadow-xl max-h-[70vh] overflow-y-auto custom-scrollbar">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                      !isSubPage && activeSection === item.id
                        ? 'bg-[#fdf0ed] text-[#c84c30] dark:bg-white/10 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { openModal('join'); setMobileMenuOpen(false) }}
                  className="mt-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#c84c30] text-white sm:hidden"
                >
                  Join Us
                </button>
                {isSubPage && (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
