<script lang="ts">
	import RSVP from './RSVP.svelte';
	import Doodle from './Doodle.svelte';

	interface Props {
		id: string;
		name: string;
	}

	const { id, name }: Props = $props();
</script>

<p class="note">RSVP</p>
<RSVP {id} {name} />
<p class="note">Doodle! <span class="gray">Only the inner area is included.</span></p>
<Doodle {id} {name} />

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
</style>
