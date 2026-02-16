import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',

  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  testMatch: ['**/*.spec.ts', '**/*.int.spec.ts'],

  moduleFileExtensions: ['ts', 'html', 'js'],

  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },

  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },

  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};

export default config;

