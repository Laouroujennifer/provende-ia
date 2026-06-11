import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    // Cette ligne permet à Ngrok d'afficher ton site sans être bloqué
    allowedHosts: ['untitled-handwork-anchor.ngrok-free.dev']
  }
})