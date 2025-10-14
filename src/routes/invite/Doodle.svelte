<script lang="ts">
	import type Editor from 'js-draw';
	import 'js-draw/bundledStyles';
	import { peopleCollection } from '$lib/collections/people';
	import debounceFunction from 'debounce-fn';
	import { onDestroy, onMount, untrack } from 'svelte';
	import { Color4, Rect2, Vec2 } from '@js-draw/math';
	import { eq, useLiveQuery } from '@tanstack/svelte-db';

	interface Props {
		id: string;
		name: string;
	}

	const { id, name }: Props = $props();

	const meQuery = useLiveQuery((q) =>
		q
			.from({ people: peopleCollection })
			.where(({ people }) => eq(people.id, id))
			.select(({ people }) => ({
				id: people.id,
				doodle: people.doodle
			}))
			.findOne()
	);

	let canvas: HTMLDivElement;
	let editor: Editor | undefined;

	const saveDoodle = debounceFunction(
		async () => {
			if (editor) {
				const svg = await editor.toSVGAsync();

				if (peopleCollection.has(id)) {
					peopleCollection.update(id, (person) => {
						person.doodle = { doodle: svg.outerHTML };
					});
				} else {
					peopleCollection.insert({
						id,
						name,
						doodle: { doodle: svg.outerHTML }
					});
				}
			}
		},
		{ wait: 300, maxWait: 2_000 }
	);

	let initialUpdatesDone = $state(false);
	const detectInitialUpdates = debounceFunction(
		() => {
			initialUpdatesDone = true;
		},
		{ wait: 200 }
	);
	$effect(() => {
		if (!initialUpdatesDone && meQuery.data) {
			detectInitialUpdates();
		}
	});

	const loadEditor = async () => {
		const { Editor, EditorEventType } = await import('js-draw');
		editor = new Editor(canvas, {
			minZoom: 0.5,
			maxZoom: 1.5
		});

		const doodle = meQuery.data[0]?.doodle;
		if (doodle) {
			editor.loadFromSVG(doodle.doodle);
		}

		editor.dispatch(editor.setBackgroundStyle({ color: Color4.fromHex('#000'), type: 1 }));
		editor.dispatch(
			editor.viewport.zoomTo(Rect2.fromCorners(Vec2.of(-10, -10), Vec2.of(510, 510)))
		);

		editor.notifier.on(EditorEventType.CommandDone, saveDoodle);
		editor.notifier.on(EditorEventType.CommandUndone, saveDoodle);
	};

	$effect(() => {
		if (meQuery.isReady && initialUpdatesDone) {
			untrack(loadEditor);
		}
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
