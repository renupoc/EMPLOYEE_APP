import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',

  // Angular test environment setup
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // Test file pattern
  testMatch: ['**/*.spec.ts'],

  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary'],

  // Supported file extensions
  moduleFileExtensions: ['ts', 'html', 'js'],

  // Angular template + TS transform
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular'
  },

  // Mock static files
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(html)$': '<rootDir>/__mocks__/htmlMock.js'
  },

  // Fix Angular + ES modules
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],

  // Faster tests
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
};

export default config;

