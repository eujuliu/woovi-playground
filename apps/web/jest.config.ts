import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$",
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["./src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
