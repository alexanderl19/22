<script lang="ts">
	interface Props {
		datetimes: number[];
		activePhoto: number;
	}

	const { datetimes, activePhoto }: Props = $props();

	const start = $derived(Math.min(...datetimes));
	const total = $derived(Math.max(...datetimes) - start);

	const datetimePercentages = $derived(
		datetimes.map((datetime) => ((datetime - start) / total) * 100)
	);
</script>

<div class="timeline">
	{#each datetimePercentages as datetimePercentage, i}
		<div
			class="marker"
			class:active={i + 1 == activePhoto}
			style:left="{datetimePercentage}%"
		></div>
	{/each}
</div>

<style>
	.timeline {
		/* font-family: 'Commit Mono', monospace; */
		position: relative;
		max-width: 60%;
		width: 100%;
	}

	.marker {
		position: absolute;
		height: 16px;
		width: 1px;
		background-color: var(--sand-9);
	}

	.active {
		background-color: var(--blue-9);
		z-index: 10;
		height: 24px;
	}
</style>
