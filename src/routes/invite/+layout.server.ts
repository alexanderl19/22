import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const people = await db().query.people.findMany();

	const me = people.find(async ({ id }) => id === (await parent()).user.id);
	const peopleByStatus = Object.groupBy(people, ({ rsvp }) => {
		if (rsvp === true) {
			return 'yes';
		} else if (rsvp === false) {
			return 'no';
		}

		return 'none';
	});

	return { peopleByStatus, me };
}) satisfies LayoutServerLoad;
