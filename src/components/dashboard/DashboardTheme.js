/**
 * Dashboard Design System & Theme Configuration
 * Aligned with InnoTech-Hub website brand identity
 */

export const dashboardTheme = {
  // Color System
  colors: {
    primary: '#c84c30', // Brand primary (burnt orange)
    accent: '#8ab4f8', // Brand accent (blue)
    
    // Light Mode
    light: {
      background: '#fdfbf7', // cozy-light
      surface: '#ffffff',
      surfaceHover: '#f9f7f3',
      border: '#e5e7eb',
      text: '#2d333b', // cozy-dark
      textSecondary: '#6b7280',
      textTertiary: '#9ca3af',
    },
    
    // Dark Mode
    dark: {
      background: '#2d333b', // cozy-dark
      surface: '#1a1f26',
      surfaceHover: '#252d36',
      border: '#404854',
      text: '#fdfbf7', // cozy-light
      textSecondary: '#d1d5db',
      textTertiary: '#9ca3af',
    },
    
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Typography
  typography: {
    display: "'Playfair Display', serif",
    serif: "'Playfair Display', serif",
    sans: "'Plus Jakarta Sans', sans-serif",
    mono: "'Courier Prime', monospace",
    
    // Sizes
    h1: { size: '2.5rem', weight: 700 }, // 40px
    h2: { size: '2rem', weight: 700 },   // 32px
    h3: { size: '1.5rem', weight: 600 }, // 24px
    h4: { size: '1.25rem', weight: 600 }, // 20px
    body: { size: '1rem', weight: 400 },   // 16px
    small: { size: '0.875rem', weight: 400 }, // 14px
    xs: { size: '0.75rem', weight: 500 },  // 12px
  },
  
  // Spacing System (8px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
  },
  
  // Border Radius
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  
  // Component Sizes
  components: {
    sidebar: {
      width: '280px',
      collapsedWidth: '80px',
      mobileBreakpoint: '1024px',
    },
    card: {
      padding: '16px',
      borderRadius: '12px',
    },
    button: {
      padding: '10px 16px',
      borderRadius: '8px',
    },
    input: {
      padding: '10px 12px',
      borderRadius: '8px',
    },
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const dashboardClasses = {
  // Reusable Tailwind-based class combinations
  card: 'bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-lg shadow-sm hover:shadow-md transition-all',
  cardHover: 'hover:bg-gray-50 dark:hover:bg-[#252d36]',
  button: 'px-4 py-2.5 rounded-lg font-medium transition-all inline-flex items-center justify-center gap-2',
  buttonPrimary: 'bg-[#c84c30] text-white hover:bg-[#b04027]',
  buttonSecondary: 'bg-gray-200 dark:bg-gray-700 text-cozy-dark dark:text-cozy-light hover:bg-gray-300',
  input: 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f26] text-cozy-dark dark:text-cozy-light focus:outline-none focus:ring-2 focus:ring-[#c84c30]',
  label: 'text-sm font-semibold text-cozy-dark dark:text-cozy-light',
  badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
  badgePrimary: 'bg-[#c84c30]/10 text-[#c84c30]',
  badgeSuccess: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  badgeWarning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
};
