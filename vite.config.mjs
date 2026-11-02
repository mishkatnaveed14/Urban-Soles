import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: resolve(rootDir, 'public/build'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(rootDir, 'src/css/main.css'),
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
