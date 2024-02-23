import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/*.test.ts"],
  clearMocks: true,
  setupFiles: ["<rootDir>/src/__tests__/setup.ts"],
  silent: true,
};

export default config;
