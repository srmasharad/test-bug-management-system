module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server.js',
    'src/**/*.js',
    '!src/**/*.test.js',
    '!node_modules/**'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js'
  ],
  verbose: true,
  testTimeout: 10000
};
