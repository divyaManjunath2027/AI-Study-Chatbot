
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',

    // Allow your temporary Cloudflare domain
    allowedHosts: ['.trycloudflare.com'],

    // Forward API requests to FastAPI
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },

      '/chat': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },

      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
