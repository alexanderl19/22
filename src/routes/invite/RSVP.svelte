<script lang="ts">
	let going = $state();
</script>

<div class="buttons">
	<label class="parent left" class:active={going === true}>
		<button
			class="button"
			onclick={() => {
				going = true;
			}}>🪼 Going</button
		>
	</label>
	<label class="parent" class:active={going === false}>
		<button
			class="button"
			onclick={() => {
				going = false;
			}}>😴 Can't Go</button
		>
	</label>
</div>

<style lang="scss">
	.buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 100%;
	}

	.parent {
		padding: 1px;
		outline-color: var(--blue-9);
		outline-offset: -1px;
		border: 1px solid var(--sand-7);
		display: block;

		&.active {
			border-color: var(--blue-7);
		}

		&:focus-within {
			outline-width: 2px;
			outline-style: solid;
			z-index: 2;
		}

		&.left {
			border-right-width: 0;
		}
	}

	.button {
		color: #ffffff;
		font-family: 'Archivo Variable', sans-serif;
		display: block;
		font-size: 0.875rem;
		line-height: 1.25rem;
		outline: none;
		border: none;
		border-radius: 1000px;
		height: 4rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--sand-9);

		&:hover {
			background-color: var(--sand-10);
		}

		&:active {
			filter: brightness(92%) saturate(1.1);

			@media (prefers-color-scheme: dark) {
				filter: brightness(108%);
			}
		}
	}

	.active .button {
		background-color: var(--blue-9);

		&:hover {
			background-color: var(--blue-10);
		}
	}
</style>
