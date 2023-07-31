import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  root: __dirname,
  publicDir: 'public',
  resolve: {},
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.tsx'),
        background: path.resolve(__dirname, 'src/workers/background.ts'),
        content: path.resolve(__dirname, 'src/scripts/content.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
      },
    },
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
    manifest: true,
    sourcemap: true,
  },
  /**
   * _NOTE_: Background service worker runs only inside the chrome extension but not in the browser.
   */
  server: {
    open: true,
    port: 3000,
    host: true,
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
})
