<script lang="ts">
	import type Editor from 'js-draw';
	import 'js-draw/bundledStyles';
	import { onDestroy, onMount } from 'svelte';
	import { Color4, Rect2, Vec2 } from '@js-draw/math';

	let canvas: HTMLDivElement;

	let editor: Editor | undefined;

	onMount(async () => {
		const { Editor } = await import('js-draw');
		editor = new Editor(canvas, {
			minZoom: 0.5,
			maxZoom: 1.5
		});
		editor.dispatch(editor.setBackgroundStyle({ color: Color4.fromHex('#000'), type: 1 }));
		editor.dispatch(
			editor.viewport.zoomTo(Rect2.fromCorners(Vec2.of(-10, -10), Vec2.of(510, 510)))
		);
	});

	onDestroy(() => {
		editor?.remove();
	});
</script>

<div class="canvas-parent" bind:this={canvas}></div>

<style>
	.canvas-parent {
		margin-top: 24px;
		border: 1px solid var(--sand-7);
		aspect-ratio: 1;
	}

	:global(:root .imageEditorContainer) {
		--background-color-1: transparent;
		width: 100%;
		height: 100%;
	}
</style>
