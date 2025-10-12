<script lang="ts">
	const messageText =
		"Hello!\nYou are cordially invited to Alexander's 22nd birthday celebration on Oct 18th.";

	const message = $derived.by(() => {
		const delaySpacing = 15;
		let delayAggregator = 500;

		return messageText.split('\n').map((line) => {
			const lineObject = {
				words: line.split(' ').map((word) => {
					const wordObject = { word, animationDelay: delayAggregator };
					delayAggregator += delaySpacing;
					return wordObject;
				})
			};
			delayAggregator += 500;
			return lineObject;
		});
	});
</script>

{#each message as line}
	<p>
		{#each line.words as { word, animationDelay }}
			<span class="word" style:animation-delay="{animationDelay}ms">
				{`${word} `}
			</span>
		{/each}
	</p>
{/each}

<style>
	@keyframes text-appear {
		0% {
			filter: blur(4px);
			opacity: 0;
		}

		100% {
			filter: blur(0px);
			opacity: 1;
		}
	}

	p {
		font-family: 'Archivo Variable', sans-serif;
		font-weight: 450;
		font-size: 1.25rem;
		font-variation-settings: 'wdth' 120;
		max-width: 30rem;
		line-height: 1.4;
		margin: 16px auto;
	}

	.word {
		animation-name: text-appear;
		animation-duration: 750ms;
		animation-fill-mode: both;
		animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}
</style>
