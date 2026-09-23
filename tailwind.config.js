/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          light: '#fdfbf7', // Off-white background
          dark: '#2d333b',  // Soft dark background
          primary: '#ff8a8a', // Pastel red/pink
          accent: '#8ab4f8'   // Pastel blue
        }
      },
      dropShadow: {
        'flat': '4px 4px 0px rgba(0, 0, 0, 0.2)', // The signature flat shadow
        'flat-hover': '6px 6px 0px rgba(0, 0, 0, 0.2)'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['Courier Prime', 'monospace'],
        pixel: ['"Press Start 2P"', 'cursive']
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-in': 'slide-in 0.3s ease-out forwards'
      }
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#d1d5db',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#9ca3af',
          },
          '@media (prefers-color-scheme: dark)': {
            '&::-webkit-scrollbar-thumb': {
              background: '#4b5563',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#6b7280',
            },
          },
        },
      })
    }
  ],
}
