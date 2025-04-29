import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
	mongoServer = await MongoMemoryReplSet.create();
	const uri = mongoServer.getUri();

	await mongoose.connect(uri);
});

afterEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});
