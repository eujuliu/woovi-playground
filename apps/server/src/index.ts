import http from 'http';

import { app } from './server/app';
import { config } from './config';
import { connectDatabase } from './database';
import { createGraphqlWs } from './server/createGraphqlWs';
import { getContext } from './server/getContext';
import { schema } from './schema/schema';

(async () => {
	await connectDatabase();

	const server = http.createServer(app.callback());

	createGraphqlWs(server, '/graphql/ws', {
		schema,
		context: getContext(),
	});

	server.listen(config.PORT, () => {
		// eslint-disable-next-line
		console.log(`Server running on port:${config.PORT}`);
	});
})();
