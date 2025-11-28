import type { LayoutServerLoad } from './$types';
import { getSession } from '$lib/server/auth/session';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_AUTH_BASE_URL, PUBLIC_BASE_URL } from '$env/static/public';

const signinHref = new URL(
	`/signin?redirect_uri=${new URL('auth/ott', PUBLIC_BASE_URL).toString()}&fd=/`,
	PUBLIC_AUTH_BASE_URL
).toString();

export const load = (async ({ request, platform }) => {
	const sessionData = await getSession(platform?.env.AUTH_API, request.headers);

	if (sessionData.signedIn) {
		return {
			signedIn: sessionData.signedIn,
			user: sessionData.user
		};
	} else {
		redirect(302, signinHref);
	}
}) satisfies LayoutServerLoad;
