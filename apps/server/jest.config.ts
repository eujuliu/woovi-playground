import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
	testPathIgnorePatterns: ['/node_modules/', './dist', '/__tests__/setup.ts'],
	resetModules: false,
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
	moduleFileExtensions: ['ts', 'js', 'tsx', 'json'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
};

export default config;
