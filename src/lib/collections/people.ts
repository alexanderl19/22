import { createCollection, type MutationFnParams } from '@tanstack/svelte-db';
import { electricCollectionOptions } from '@tanstack/electric-db-collection';
import { PUBLIC_BASE_URL } from '$env/static/public';

type PeopleCollection = {
	id: string;
	name: string;
	rsvp?: boolean;
	doodle?: { doodle: string };
};

const onInsertUpdate = async ({ transaction }: MutationFnParams<PeopleCollection>) => {
	const newItem = transaction.mutations[0].modified;
	const response = await fetch('/api/people', {
		method: 'PUT',
		body: JSON.stringify(newItem),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const txid = (await response.json()).txid as number;

	return { txid };
};

export const peopleCollection = createCollection(
	electricCollectionOptions<PeopleCollection>({
		shapeOptions: {
			url: `${PUBLIC_BASE_URL}/api/people`
		},
		getKey: (item) => item.id,

		onInsert: onInsertUpdate,
		onUpdate: onInsertUpdate
	})
);
