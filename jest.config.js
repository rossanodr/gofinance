
module.exports = {
    preset: "jest-expo",
    testPathIgnorePatterns: [
        '/node_modules',
        '/android',
        'ios'
    ],
    setupFiles: ["<rootDir>/jestSetupFile.js"],
    
    setupFilesAfterEnv: ['jest-styled-components'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.tsx',
        "!src/**/*.spec.tsx"
    ],
    collectReporters: [
        'lcov'
    ]
  }

  