import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined = undefined;

export const setConnectionString = (url: string) => {
	const client = postgres(url);

	dbInstance = drizzle(client, { schema });
};

export const db = () => {
	if (!dbInstance) {
		throw Error('DB instance used before initialization.');
	}

	return dbInstance;
};
