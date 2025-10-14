<script lang="ts">
	// import Images from './screens/images/Images.svelte';
	import Loading from './screens/loading/Loading.svelte';

	let stage = $state<'loading' | 'photos' | 'invite' | 'list'>('invite');

	let loadingPercentage = $state(0);

	const onLoadingDone = () => {
		if (stage == 'loading') {
			stage = 'photos';
		}
	};

	const onAnimationDone = () => {
		stage = 'invite';
	};

	$effect(() => {});
</script>

{#if stage === 'loading'}
	<Loading {loadingPercentage} />
{/if}
{#if stage === 'loading' || stage === 'photos'}
	<!-- <Images visible={stage == 'photos'} {onLoadingDone} {onAnimationDone} bind:loadingPercentage /> -->
{/if}
