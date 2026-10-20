import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // React y el enrutador cambian poco: en su propio archivo quedan en caché entre versiones del sitio.
        manualChunks: { vendor: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
  // base: '/cerrito-del-carmen/',  // descomentar si se publica en GitHub Pages bajo un subdirectorio
})
