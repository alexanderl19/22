import type { LayoutServerLoad } from './$types';
import { getSession } from '$lib/server/auth/session';

export const load = (async ({ request }) => {
	const sessionData = await getSession(request.headers);

	if (sessionData.signedIn) {
		return {
			signedIn: sessionData.signedIn,
			user: sessionData.user
		};
	} else {
		return {
			signedIn: sessionData.signedIn
		};
	}
}) satisfies LayoutServerLoad;
