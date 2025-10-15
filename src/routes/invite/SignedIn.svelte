<script lang="ts">
	import RSVP from './RSVP.svelte';
	import Doodle from './Doodle.svelte';
	import { eq, useLiveQuery } from '@tanstack/svelte-db';
	import { peopleCollection } from '$lib/collections/people';

	interface Props {
		id: string;
		name: string;
	}

	const { id, name }: Props = $props();

	const peopleRsvpYesQuery = useLiveQuery((q) =>
		q.from({ people: peopleCollection }).where(({ people }) => eq(people.rsvp, true))
	);
	const peopleRsvpNoQuery = useLiveQuery((q) =>
		q.from({ people: peopleCollection }).where(({ people }) => eq(people.rsvp, false))
	);
</script>

<p class="note">RSVP</p>
<RSVP {id} {name} />
<p class="note">Doodle! <span class="gray">Only the inner area is included.</span></p>
<Doodle {id} {name} />
<p class="note">Going ({peopleRsvpYesQuery.data.length})</p>
<ul class="people">
	{#if peopleRsvpYesQuery.isReady}
		{#each peopleRsvpYesQuery.data as person (person.id)}
			<li class="person">
				<div class="doodle">{@html person.doodle?.doodle}</div>
				{person.name}
			</li>{/each}
	{/if}
</ul>
<p class="note">Can't Go ({peopleRsvpNoQuery.data.length})</p>
<ul class="people">
	{#if peopleRsvpNoQuery.isReady}
		{#each peopleRsvpNoQuery.data as person (person.id)}
			<li class="person">
				<div class="doodle">{@html person.doodle?.doodle}</div>
				{person.name}
			</li>{/each}
	{/if}
</ul>

<style lang="scss">
	.note {
		font-family: 'Archivo Variable', sans-serif;
		font-weight: 400;
		font-size: 0.85rem;
		margin: 48px 0 8px 0;
	}

	.gray {
		color: var(--sand-11);
	}

	.people {
		padding: 0;

		:global(.js-draw-image-background) {
			display: none;
		}
	}

	.person {
		list-style: none;
		font-family: 'Archivo Variable', sans-serif;
		font-size: 1.15rem;
		font-variation-settings: 'wdth' 110;
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.doodle {
		height: 64px;
		width: 64px;

		:global(svg) {
			height: 64px;
			width: 64px;
		}
		filter: invert(1);

		@media (prefers-color-scheme: dark) {
			filter: invert(0);
		}
	}
</style>
