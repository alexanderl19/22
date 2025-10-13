<script lang="ts">
	interface Props {
		text: string;
		as?: 'button' | 'a';
		href?: string;
	}

	const { text, as = 'button', href }: Props = $props();
</script>

<div class="parent">
	{#if as === 'button'}
		<button class="button">
			{text}
		</button>
	{:else if as === 'a'}
		<a {href} class="button link">
			{text}
		</a>
	{/if}
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
		font-family: 'Archivo Variable', sans-serif;
		display: block;
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

	.link {
		color: #ffffff;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
