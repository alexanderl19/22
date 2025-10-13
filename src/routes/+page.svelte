<script lang="ts">
	import { untrack } from 'svelte';
	import Images from './screens/images/Images.svelte';
	import Loading from './screens/loading/Loading.svelte';

	let stage = $state<'loading' | 'photos' | 'invite' | 'list'>('loading');

	let imagesDoneLoading = $state(false);
	let loadingPercentage = $state(0);

	$effect(() => {
		if (untrack(() => stage) == 'loading' && imagesDoneLoading) {
			stage = 'photos';
		}
	});
</script>

<Loading {loadingPercentage} />
<Images visible={stage == 'photos'} bind:doneLoading={imagesDoneLoading} bind:loadingPercentage />
