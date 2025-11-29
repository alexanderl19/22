import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const me = locals.people.find(async ({ id }) => id === locals.user.id);
	const peopleByStatus = Object.groupBy(locals.people, ({ rsvp }) => {
		if (rsvp === true) {
			return 'yes';
		} else if (rsvp === false) {
			return 'no';
		}

		return 'none';
	});

	return { peopleByStatus, me };
}) satisfies LayoutServerLoad;
