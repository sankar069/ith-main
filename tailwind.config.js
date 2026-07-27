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
        }
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards'
      }
    },
  },
  plugins: [],
}
