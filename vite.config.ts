/* eslint-disable */
import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

/* eslint-enable */
export default defineConfig({
  plugins: [
    react({ plugins: [['@swc/plugin-styled-components', {}]] }),
    reactRefresh(),
    tsconfigPaths(),
    cssInjectedByJsPlugin(),
    svgr({
      exportAsDefault: true,
    }),
  ],
  root: __dirname,
  publicDir: 'public',
  resolve: {},
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, '/src/index.tsx'),
        background: path.resolve(__dirname, '/src/workers/background.ts'),
        content: path.resolve(__dirname, '/src/scripts/content.tsx'),
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
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
    },
  },
})
