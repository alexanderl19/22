<script lang="ts">
	import { onMount } from 'svelte';

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
	});
</script>

{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img class="image home-image" src={module.default} alt="" />
{/each}

<style>
	.image {
		width: 75vw;
		height: 75vh;
		object-fit: contain;
	}
</style>
