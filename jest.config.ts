import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/*.test.ts"],
};

export default config;
