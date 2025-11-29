// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { Session, User } from './lib/server/auth/session';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			people: {
				id: string;
				name: string;
				rsvp: boolean | null;
				doodle: {
					doodle: string;
				} | null;
			}[];
			user: User;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
		}
	}
}

export {};
