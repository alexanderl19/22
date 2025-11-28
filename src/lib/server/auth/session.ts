import { PUBLIC_BASE_URL } from '$env/static/public';

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
				firstName: string;
				lastName: string;
				createdAt: Date;
				updatedAt: Date;
				image?: string | null | undefined | undefined;
			};
	  };

export const getSession = async (binding: Fetcher | undefined, headers: Headers) => {
	if (!binding) {
		throw Error('Session binding missing.');
	}

	const sessionResponse = await binding.fetch(new URL('/session', PUBLIC_BASE_URL), {
		headers
	});

	const sessionData = (await sessionResponse.json()) as SessionData;

	return sessionData;
};
