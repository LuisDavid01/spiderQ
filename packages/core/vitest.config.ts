import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,  // para que expect, describe, etc. estén globales como en Jest
    include: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
