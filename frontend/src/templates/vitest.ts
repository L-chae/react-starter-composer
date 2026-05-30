export const getVitestConfigTemplate = () => `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  }
})
`;

export const getVitestSetupTemplate = () => `import '@testing-library/jest-dom'
`;