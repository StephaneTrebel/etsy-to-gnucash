/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^csv-stringify/sync':
      '<rootDir>/node_modules/csv-stringify/dist/cjs/sync.cjs',
    '^csv-parse/sync': '<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs',
  },

  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts', '!**/*.spec.ts', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'json', ['text', { skipFull: true }]],
};
