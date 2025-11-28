<script lang="ts">
	type Person = {
		id: string;
		name: string;
		doodle: {
			doodle: string;
		} | null;
	};

	interface Props {
		peopleRsvpYes: Person[];
		peopleRsvpNo: Person[];
	}

	const { peopleRsvpYes, peopleRsvpNo }: Props = $props();
</script>

<p class="note">Going ({peopleRsvpYes.length})</p>
<ul class="people">
	{#each peopleRsvpYes as person (person.id)}
		<li class="person">
			<div class="doodle">{@html person.doodle?.doodle}</div>
			{person.name}
		</li>
	{/each}
</ul>
<p class="note">Can't Go ({peopleRsvpNo.length})</p>
<ul class="people">
	{#each peopleRsvpNo as person (person.id)}
		<li class="person">
			<div class="doodle">{@html person.doodle?.doodle}</div>
			{person.name}
		</li>
	{/each}
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
		margin-bottom: 6px;
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
