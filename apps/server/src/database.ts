import mongoose from 'mongoose';

import { config } from './config';
import { seedATM } from '../scripts/seedATM';

async function connectDatabase() {
	// eslint-disable-next-line
	mongoose.connection.on('close', () =>
		console.log('Database connection closed.')
	);

	await mongoose.connect(config.MONGO_URI);
	if (config.NODE_ENV.startsWith('dev')) await seedATM();
}

export { connectDatabase };
