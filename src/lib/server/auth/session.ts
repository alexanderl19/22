import { PUBLIC_BASE_URL } from '$env/static/public';

export type Session = {
	id: string;
	userId: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
	token: string;
	ipAddress?: string | null | undefined | undefined;
	userAgent?: string | null | undefined | undefined;
};

export type User = {
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

type SessionData =
	| { signedIn: false }
	| {
			signedIn: true;
			session: Session;
			user: User;
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
