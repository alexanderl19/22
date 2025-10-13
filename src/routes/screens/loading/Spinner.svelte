<script lang="ts">
	import type { SpinnerName } from 'cli-spinners';

	import cliSpinners from 'cli-spinners';
	import { onMount } from 'svelte';

	const spinnerName: SpinnerName = 'pong';

	let frame = $state(0);
	onMount(() => {
		const interval = setInterval(() => {
			if (frame < cliSpinners[spinnerName].frames.length - 1) {
				frame++;
			} else {
				frame = 0;
			}
		}, cliSpinners[spinnerName].interval);

		return () => clearInterval(interval);
	});
</script>

<p>{cliSpinners[spinnerName].frames[frame]}</p>

<style>
	p {
		font-family: 'Commit Mono', monospace;
		margin: 0;
		line-height: 28px;
		white-space: pre;
	}
</style>
