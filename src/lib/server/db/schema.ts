import { pgTable, boolean, text, jsonb } from 'drizzle-orm/pg-core';

export const people = pgTable('people', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	rsvp: boolean('rsvp'),
	doodle: jsonb('doodle').$type<{ doodle: string }>()
});
