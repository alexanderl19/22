import { ELECTRIC_SECRET, ELECTRIC_SOURCE_ID } from '$env/static/private';
import { db } from '$lib/server/db';
import { people } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from '@electric-sql/client';
import { getSession } from '$lib/server/auth/session';
import { error, json } from '@sveltejs/kit';
import * as z from 'zod';
import { sql } from 'drizzle-orm';
import type { Txid } from '@tanstack/electric-db-collection';

export const GET: RequestHandler = async ({ url }) => {
	const electricUrl = new URL('https://api.electric-sql.cloud/v1/shape');

	// Forward only Electric protocol parameters
	ELECTRIC_PROTOCOL_QUERY_PARAMS.forEach((paramName) => {
		const paramValue = url.searchParams.get(paramName);
		if (paramValue) {
			electricUrl.searchParams.set(paramName, paramValue);
		}
	});

	electricUrl.searchParams.set('table', 'people');
	electricUrl.searchParams.set('source_id', ELECTRIC_SOURCE_ID);
	electricUrl.searchParams.set('secret', ELECTRIC_SECRET);

	const response = await fetch(electricUrl);

	// Fetch decompresses the body but doesn't remove the
	// content-encoding & content-length headers which would
	// break decoding in the browser.
	//
	// See https://github.com/whatwg/fetch/issues/1729
	const headers = new Headers(response.headers);
	headers.delete(`content-encoding`);
	headers.delete(`content-length`);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

const Updates = z.object({
	name: z.string().optional(),
	rsvp: z.coerce.boolean().optional()
});

const generateTxId = async (
	tx: Parameters<Parameters<(typeof db)['transaction']>[0]>[0]
): Promise<Txid> => {
	const result = await tx.execute(sql`SELECT pg_current_xact_id()::xid::text as txid`);
	const txid = result[0]?.txid;

	if (typeof txid !== 'string') {
		throw new Error(`Failed to get transaction ID`);
	}

	return parseInt(txid, 10);
};

export const PUT: RequestHandler = async ({ request }) => {
	const sessionData = await getSession(request.headers);

	if (!sessionData.signedIn) {
		return error(401, 'Unauthorized');
	}

	const updates = Updates.parse(await request.json());

	const txid = await db.transaction(async (tx) => {
		const txid = await generateTxId(tx);
		await tx
			.insert(people)
			.values({ id: sessionData.user.id, name: sessionData.user.name, rsvp: updates.rsvp })
			.onConflictDoUpdate({
				target: people.id,
				set: { name: sessionData.user.name, rsvp: updates.rsvp }
			});

		return txid;
	});

	return json({ txid });
};
