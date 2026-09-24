import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base: '/cerrito-del-carmen/',  // descomentar si se publica en GitHub Pages bajo un subdirectorio
})
