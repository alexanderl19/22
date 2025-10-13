<script lang="ts">
	interface Props {
		text: string;
	}

	const { text }: Props = $props();
</script>

<div class="parent">
	<button class="button">
		{text}
	</button>
</div>

<style>
	.parent {
		padding: 1px;
		outline-color: var(--blue-9);
		outline-offset: -1px;
		border: 1px solid var(--sand-7);
		display: block;
	}

	.parent:focus-within {
		outline-width: 2px;
	}

	.button {
		font-size: 0.875rem;
		line-height: 1.25rem;
		outline: none;
		border: none;
		border-radius: 1000px;
		background-color: var(--blue-9);
		height: 2.75rem;
		width: 100%;
	}

	.button:hover {
		background-color: var(--blue-10);
	}

	.button:active {
		filter: brightness(108%);
	}
</style>
