import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'AI Suite', id: 'ai-suite' },
    { name: 'SaaS', id: 'saas' },
    { name: 'Events', id: 'events' },
    { name: 'Team', id: 'team' },
    { name: 'Roadmap', id: 'roadmap' },
    { name: 'Partners', id: 'partners' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className={`fixed top-4 left-0 right-0 z-50 flex justify-center w-full transition-all duration-300 px-4 ${isScrolled ? 'top-2' : 'top-6'}`}>
        {/* Glass Container */}
        <div 
          className="relative flex items-center justify-between px-6 py-3 rounded-full bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-500 w-full max-w-5xl"
          style={{
            boxShadow: isScrolled ? '0 10px 40px -10px rgba(0,0,0,0.1)' : '0 4px 20px -10px rgba(0,0,0,0.05)',
            background: isScrolled ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)',
            // Dark mode overrides
          }}
        >
          {/* Dark Mode Overlay for Glass */}
          <div className="absolute inset-0 rounded-full dark:bg-black/40 -z-10 transition-colors duration-300"></div>
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 overflow-hidden rounded-lg shadow-sm border border-black/10 dark:border-white/10 flex items-center justify-center bg-[#0d213b]">
              <img src="/ith-logo.jpg" alt="InnoTech Hub Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-serif font-bold text-lg text-cozy-dark dark:text-cozy-light tracking-wide hidden sm:block">
              InnoTech Hub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'text-[#c84c30] dark:text-white' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-4 right-4 z-40 lg:hidden"
          >
            <div className="bg-white/80 dark:bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10 p-4 flex flex-col gap-2 shadow-2xl">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                    activeSection === item.id 
                      ? 'bg-red-50 text-[#c84c30] dark:bg-white/10 dark:text-white' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
