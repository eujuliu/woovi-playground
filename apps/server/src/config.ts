import path from 'node:path';

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root('.env'),
	sample: root('.env.example'),
});

const ENV = process.env;

const config = {
	PORT: ENV.PORT ?? 4000,
	MONGO_URI: ENV.MONGO_URI ?? '',
	NODE_ENV: ENV.NODE_ENV ?? 'production',
	REDIS_HOST: ENV.REDIS_HOST ?? '',
};

export { config };
