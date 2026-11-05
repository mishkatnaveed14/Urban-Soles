import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  build: {
    outDir: resolve(rootDir, 'public/build'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'src/css/main.css'),
        home: resolve(rootDir, 'src/js/home.jsx'),
        navigation: resolve(rootDir, 'src/js/navigation.js'),
      },
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js',
      },
    },
  },
})
