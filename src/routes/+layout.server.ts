import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getSession } from '$lib/server/auth/session';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_AUTH_BASE_URL, PUBLIC_BASE_URL } from '$env/static/public';

const signinHref = new URL(
	`/signin?redirect_uri=${new URL('auth/ott', PUBLIC_BASE_URL).toString()}&fd=/`,
	PUBLIC_AUTH_BASE_URL
).toString();

export const load = (async ({ request, platform }) => {
	const people = await db().query.people.findMany();

	const sessionData = await getSession(platform?.env.AUTH_API, request.headers);

	if (!sessionData.signedIn) {
		redirect(302, signinHref);
	}

	if (!people.some(({ id }) => id === sessionData.user.id)) {
		error(500, 'Your account does not have access to this page.');
	}

	return {
		people,
		signedIn: sessionData.signedIn,
		user: sessionData.user
	};
}) satisfies LayoutServerLoad;
