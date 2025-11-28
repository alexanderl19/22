import { setConnectionString } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleDb: Handle = async ({ event, resolve }) => {
	const dbConnectionString = event.platform?.env.HYPERDRIVE.connectionString;
	if (!dbConnectionString) {
		throw Error('Hyperdrive binding missing.');
	}

	setConnectionString(dbConnectionString);

	return resolve(event);
};

export const handleAuthRewrite: Handle = async ({ event, resolve }) => {
	const authRedirectBinding = event.platform?.env.AUTH_REDIRECT;
	if (!authRedirectBinding) {
		throw Error('Auth redirect binding missing.');
	}

	if (event.url.pathname.startsWith('/auth')) {
		return await authRedirectBinding.fetch(event.request.url, { redirect: 'manual' });
	}

	return await resolve(event);
};

export const handle = sequence(handleDb, handleAuthRewrite);
