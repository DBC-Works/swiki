// @ts-nocheck
import * as path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  test: {
    globals: true,
    root: 'src',
    environment: 'happy-dom',
    setupFiles: './src/setupTest.ts',
    alias: [
      {
        find: /.*\.svg/,
        replacement: path.resolve(__dirname, './src/__mock__/svg.tsx'),
      },
      {
        find: /@emotion\/react/,
        replacement: path.resolve(__dirname, './src/__mock__/emotion.ts'),
      },
      {
        find: /.*\/GlobalStyles/,
        replacement: path.resolve(__dirname, './src/__mock__/GlobalStyles.tsx'),
      },
    ],
    coverage: {
      exclude: ['__mock__', '**/types.ts', 'main.tsx', 'vite-env.d.ts', './setupTest.d.ts'],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '../build/coverage',
    },
  },
})
