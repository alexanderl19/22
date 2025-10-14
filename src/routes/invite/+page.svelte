<script lang="ts">
	import type { PageProps } from './$types';
	import { PUBLIC_AUTH_BASE_URL, PUBLIC_BASE_URL } from '$env/static/public';
	import Button from '$lib/components/Button.svelte';
	import SignedIn from './SignedIn.svelte';

	let { data }: PageProps = $props();

	const messageLines = [
		`Hello${data.signedIn ? ' ' + data.user.firstName : ''}! `,
		"You are cordially invited to Alexander's 22nd birthday celebration on Oct 18th, starting at 8PM.",
		'Drinks, ice cream, and light refreshments will be provided.',
		"No gifts please. However, if you already have something in mind, please try to keep it small — I'm running out of space!",
		...(data.signedIn ? [] : ['Please sign in to RSVP and create your doodle.'])
	];

	const message = $derived.by(() => {
		const delaySpacing = 10;
		let delayAggregator = 500;

		return {
			lines: messageLines.map((line) => {
				const lineObject = {
					words: line.split(' ').map((word) => {
						const wordObject = { word, animationDelay: delayAggregator };
						delayAggregator += delaySpacing;
						return wordObject;
					})
				};
				delayAggregator += 50;
				return lineObject;
			}),
			totalDelay: delayAggregator
		};
	});

	const signinHref = new URL(
		`/signin?redirect_uri=${new URL('auth/ott', PUBLIC_BASE_URL).toString()}&fd=/invite`,
		PUBLIC_AUTH_BASE_URL
	).toString();
</script>

<div class="center">
	<div class="spacing">
		<div class="line"></div>
		<div class="right-line-parent">
			<div class="line"></div>
		</div>
		<div class="message">
			{#each message.lines as line}
				<p>
					{#each line.words as { word, animationDelay }}
						<span class="word" style:animation-delay="{animationDelay}ms">
							{`${word} `}
						</span>
					{/each}
				</p>
			{/each}
		</div>
		<div class="content" style:animation-delay="{message.totalDelay + 100}ms">
			{#if !data.signedIn}
				<Button as="a" href={signinHref} text="Sign In" />
			{:else}
				<SignedIn id={data.user.id} name={data.user.name} />
			{/if}
		</div>
	</div>
</div>

<style>
	.center {
		margin: 0 auto;
		max-width: 35rem;
	}

	.spacing {
		position: relative;
		margin: 96px 16px;
	}

	@keyframes line-animation {
		0% {
			opacity: 0;
			height: 0;
		}

		100% {
			opacity: 1;
			height: 100vh;
		}
	}

	.line {
		animation-name: line-animation;
		animation-duration: 1s;
		animation-fill-mode: both;
		animation-timing-function: cubic-bezier(0.11, 0, 0.5, 0);
		background-color: var(--sand-4);
		top: 0;
		width: 1px;
		position: fixed;
		z-index: -1;
	}

	.right-line-parent {
		position: absolute;
		right: 1px;
	}

	.message {
		margin: 96px 0 48px 0;
	}

	p {
		font-family: 'Archivo Variable', sans-serif;
		font-weight: 450;
		font-size: 1.35rem;
		font-variation-settings: 'wdth' 110;
		line-height: 1.4;
		margin: 16px 0;
	}

	@keyframes text-appear {
		0% {
			filter: blur(4px);
			opacity: 0;
		}

		100% {
			filter: none;
			opacity: 1;
		}
	}

	.word {
		animation-name: text-appear;
		animation-duration: 750ms;
		animation-fill-mode: both;
		animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}

	@keyframes appear {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.content {
		animation-name: appear;
		animation-duration: 750ms;
		animation-fill-mode: both;
		animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}
</style>
