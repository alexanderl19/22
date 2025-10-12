<script lang="ts">
	import { onMount } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import Timeline from './Timeline.svelte';

	interface Props {
		visible?: boolean;
	}

	const { visible = true }: Props = $props();

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

	const activePhotoTween = new Tween(0, {
		duration: 15_000,
		easing: sineInOut
	});
	const activePhoto = $derived(Math.round(activePhotoTween.current));

	onMount(() => {
		Promise.all(
			Array.from(document.querySelectorAll<HTMLImageElement>('.home-image'))
				.filter((img) => !img.complete)
				.map(
					(img) =>
						new Promise((resolve) => {
							img.onload = img.onerror = resolve;
						})
				)
		).then(() => {
			console.log('images finished loading');
		});

		activePhotoTween.set(imageCount);
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
	<Timeline {datetimes} {activePhoto} />
</div>

<style>
	.parent {
		height: 100vh;
		height: 100svh;
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
