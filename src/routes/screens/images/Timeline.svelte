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

<div class="parent">
	<div class="timeline">
		{#each datetimePercentages as datetimePercentage, i}
			<div
				class="marker"
				class:active={i + 1 == activePhoto}
				style:left="{datetimePercentage}%"
			></div>
		{/each}
	</div>
</div>

<style>
	.parent {
		position: fixed;
		margin: 0 16px;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.timeline {
		position: relative;
		margin: 0 auto;
		height: 24px;
		max-width: 768px;
	}

	.marker {
		position: absolute;
		margin-top: 8px;
		height: 16px;
		width: 1px;
		background-color: var(--sand-9);
	}

	.active {
		background-color: var(--blue-9);
		margin-top: 0;
		z-index: 10;
		height: 24px;
	}
</style>
