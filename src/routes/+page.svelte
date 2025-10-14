<script lang="ts">
	import { goto } from '$app/navigation';
	import Images from './screens/images/Images.svelte';
	import Loading from './screens/loading/Loading.svelte';

	let loading = $state(true);
	let loadingPercentage = $state(0);

	const onLoadingDone = () => {
		loading = false;
	};

	const onAnimationDone = () => {
		goto('/invite');
	};
</script>

{#if loading}
	<Loading {loadingPercentage} />
{/if}
<Images visible={!loading} {onLoadingDone} {onAnimationDone} bind:loadingPercentage />
