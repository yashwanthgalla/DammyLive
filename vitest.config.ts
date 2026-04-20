import { defineConfig } from 'vitest/config'

/**
 * Vitest configuration for F1 Live Dashboard
 * Unit tests for hooks, utilities, and API clients
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/index.ts',
      ],
    },
  },
})
