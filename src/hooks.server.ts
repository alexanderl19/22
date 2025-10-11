import { dev } from '$app/environment';
import * as env from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (dev && env.DEV_AUTH_REDIRECT_URL && event.url.pathname.startsWith('/auth')) {
		const originalUrl = new URL(event.request.url);
		const newUrl = new URL(
			`${originalUrl.pathname}${originalUrl.search}`,
			env.DEV_AUTH_REDIRECT_URL
		);

		return await fetch(new Request(newUrl, event.request), { redirect: 'manual' });
	}

	return await resolve(event);
};
