<script lang="ts">
	import Spinner from './Spinner.svelte';

	interface Props {
		loadingPercentage: number;
	}

	const { loadingPercentage }: Props = $props();
</script>

<div class="parent">
	<Spinner />
	<p class="progress">{Math.round(loadingPercentage)}%</p>
</div>

<style>
	.parent {
		height: 100vh;
		height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.progress {
		font-family: 'Commit Mono', monospace;
	}
</style>
