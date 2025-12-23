import { defineConfig } from 'vitest/config'
import * as path from 'node:path'
const dirname = path.resolve()

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx,js}', 'tests/**/*.test.{ts,tsx,js}'],
    silent: false,
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: ['**/node_modules/**', '**/dist/**', 'src/stories/**'],
    },
  },
})
