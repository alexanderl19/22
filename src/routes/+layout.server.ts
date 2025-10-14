import type { LayoutServerLoad } from './$types';
import { AUTH_API_BASE_URL } from '$env/static/private';

type SessionData =
	| { signedIn: false }
	| {
			signedIn: true;
			session: {
				id: string;
				userId: string;
				expiresAt: Date;
				createdAt: Date;
				updatedAt: Date;
				token: string;
				ipAddress?: string | null | undefined | undefined;
				userAgent?: string | null | undefined | undefined;
			};
			user: {
				id: string;
				email: string;
				emailVerified: boolean;
				name: string;
				createdAt: Date;
				updatedAt: Date;
				image?: string | null | undefined | undefined;
			};
	  };

export const load = (async ({ request }) => {
	const sessionResponse = await fetch(new URL('/session', AUTH_API_BASE_URL), {
		headers: request.headers
	});
	const sessionData = (await sessionResponse.json()) as SessionData;

	return {
		signedIn: sessionData.signedIn,
		user: sessionData.signedIn ? sessionData.user : undefined
	};
}) satisfies LayoutServerLoad;
