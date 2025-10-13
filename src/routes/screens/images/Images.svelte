<script lang="ts">
	import { onMount } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import Timeline from './Timeline.svelte';

	interface Props {
		visible?: boolean;
		onLoadingDone?: () => void;
		loadingPercentage?: number;
		onAnimationDone?: () => void;
	}

	let {
		visible = true,
		onLoadingDone,
		loadingPercentage = $bindable(0),
		onAnimationDone
	}: Props = $props();

	type Image = {
		default: {
			sources: {
				avif: string;
				webp: string;
			};
			img: {
				src: string;
				w: number;
				h: number;
			};
		};
	};

	export const imageModules = import.meta.glob<Image>('$lib/assets/photos/*.avif', {
		eager: true,
		query: { enhanced: true, format: 'avif;webp;jpeg;', w: '' }
	});

	const imageCount = $derived(Object.keys(imageModules).length);

	const activePhotoTween = new Tween(1, {
		duration: 15_000,
		easing: sineInOut
	});
	const activePhoto = $derived(Math.round(activePhotoTween.current));

	// defensive - should be the same as imageCount
	// svelte-ignore state_referenced_locally intentionally ignore future imageCount updates (there should be none anyways)
	let imageCountLoading = $state(imageCount);
	let imagesLoadedCount = $state(0);
	$effect(() => {
		loadingPercentage = (imagesLoadedCount / imageCountLoading) * 100;
	});
	let imagesDoneLoading = $state(false);

	onMount(() => {
		const imageElements = Array.from(document.querySelectorAll<HTMLImageElement>('.home-image'));
		imageCountLoading = imageElements.length;

		const loadingPromises = imageElements
			.filter((img) => !img.complete)
			.map(
				(img) =>
					new Promise<void>((resolve) => {
						img.onload = img.onerror = () => {
							imagesLoadedCount += 1;
							resolve();
						};
					})
			);

		// add already loaded images to count
		imagesLoadedCount += imageCountLoading - loadingPromises.length;

		Promise.all(loadingPromises).then(() => {
			imagesDoneLoading = true;
			onLoadingDone?.();
		});
	});

	$effect(() => {
		if (visible && imagesDoneLoading) {
			activePhotoTween.set(imageCount).then(() => {
				onAnimationDone?.();
			});
		}
	});

	const datetimes = $derived(
		Object.keys(imageModules)
			.map((path) => path.match(/\d*(?=\.avif$)/)?.[0])
			.filter((time) => time !== undefined)
			.map((time) => Number(time))
			.sort()
	);
</script>

<div class="parent" style:opacity={visible ? '1' : '0'}>
	<div class="images">
		{#each Object.entries(imageModules) as [_path, module], i}
			<enhanced:img
				class="image home-image"
				style:opacity={i + 1 == activePhoto ? '1' : '0'}
				src={module.default}
				alt=""
			/>
		{/each}
	</div>
</div>
{#if visible}
	<Timeline {datetimes} {activePhoto} />
{/if}

<style>
	.parent {
		position: fixed;
		height: 100vh;
		height: 100svh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.images {
		position: relative;
		width: 75vw;
		height: 75vh;
	}

	.image {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
