// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "babel-jest", // Wandelt TypeScript und JSX um
  },
  transformIgnorePatterns: [
    "/node_modules/", // Ignoriert node_modules
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js", // Mock für CSS-Dateien
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock für Bilddateien
  },
};
