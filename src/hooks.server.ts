import { setConnectionString } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_AUTH_BASE_URL, PUBLIC_BASE_URL } from '$env/static/public';
import { db } from '$lib/server/db';
import { getSession } from '$lib/server/auth/session';

const handleDb: Handle = async ({ event, resolve }) => {
	const dbConnectionString = event.platform?.env.HYPERDRIVE.connectionString;
	if (!dbConnectionString) {
		throw Error('Hyperdrive binding missing.');
	}

	setConnectionString(dbConnectionString);

	return resolve(event);
};

const handleAuthRewrite: Handle = async ({ event, resolve }) => {
	const authRedirectBinding = event.platform?.env.AUTH_API;
	if (!authRedirectBinding) {
		throw Error('Auth redirect binding missing.');
	}

	if (event.url.pathname.startsWith('/auth')) {
		event.url.pathname = '/rewrite' + event.url.pathname.slice(5);
		return await authRedirectBinding.fetch(event.request.url, { redirect: 'manual' });
	}

	return await resolve(event);
};

const signinHref = new URL(
	`/signin?redirect_uri=${new URL('auth/ott', PUBLIC_BASE_URL).toString()}&fd=/`,
	PUBLIC_AUTH_BASE_URL
).toString();

const handleAuth: Handle = async ({ event, resolve }) => {
	const people = await db().query.people.findMany();

	const sessionData = await getSession(event.platform?.env.AUTH_API, event.request.headers);

	if (!sessionData.signedIn) {
		return Response.redirect(signinHref, 302);
	}

	if (!people.some(({ id }) => id === sessionData.user.id)) {
		return new Response('Your account does not have access to this page.', { status: 500 });
	}

	event.locals.people = people;
	event.locals.user = sessionData.user;

	return await resolve(event);
};

export const handle = sequence(handleDb, handleAuthRewrite, handleAuth);
