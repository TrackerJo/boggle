import { defineConfig } from 'vite'
import { resolve } from 'path'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// vite.config.js
export default defineConfig({
    // config options
    root,
    base: '/boggle/',
    build: {
      outDir,
      emptyOutDir: true,
      input: {
        index: resolve(root,  'index.html'),
        challenge: resolve(root,  'challenge' ,'index.html'),
      }
    }
  })