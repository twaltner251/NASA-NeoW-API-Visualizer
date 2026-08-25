import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'], /* remove all console.logs in production */
  },
  base: 'NASA-NeoW-API-Visualizer'
})