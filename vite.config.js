import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    include: ['ogl'],
  },
  server: {
    host: '0.0.0.0', // Expose to network
    port: 3000,
    strictPort: true,
    // Local-only: forwards /api/** to Supabase directly for network access
    // When using dev:network, API calls go directly to Supabase
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
