<script lang="ts">
	import type { Editor, PenTool, EraserTool } from 'js-draw';
	import 'js-draw/bundledStyles';
	import { peopleCollection } from '$lib/collections/people';
	import debounceFunction from 'debounce-fn';
	import { onDestroy, untrack } from 'svelte';
	import { Color4, Rect2, Vec2 } from '@js-draw/math';
	import { eq, useLiveQuery } from '@tanstack/svelte-db';
	import { PencilLine, Eraser, Trash2 } from 'lucide-svelte';

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
	let pen1: PenTool;
	let pen2: PenTool;
	let pen3: PenTool;
	let eraser: EraserTool;

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
		{ wait: 500 }
	);
	$effect(() => {
		if (!initialUpdatesDone && meQuery.data) {
			detectInitialUpdates();
		}
	});

	const loadEditor = async (loadExisting = true) => {
		const {
			Editor,
			EditorEventType,
			PenTool,
			EraserTool,
			EraserMode,
			makePressureSensitiveFreehandLineBuilder
		} = await import('js-draw');
		editor = new Editor(canvas, {
			minZoom: 0.2,
			maxZoom: 2,
			wheelEventsEnabled: false
		});

		if (loadExisting) {
			const doodle = meQuery.data[0]?.doodle;
			if (doodle) {
				await editor.loadFromSVG(doodle.doodle);
			}
		}

		await editor.dispatch(editor.image.setAutoresizeEnabled(false));
		await editor.dispatch(
			editor.setBackgroundStyle({ autoresize: false, color: Color4.black, type: 0 })
		);
		await editor.dispatch(
			editor.viewport.zoomTo(Rect2.fromCorners(Vec2.of(0, 0), Vec2.of(500, 500)), true, false),
			false
		);

		editor.notifier.on(EditorEventType.CommandDone, saveDoodle);
		editor.notifier.on(EditorEventType.CommandUndone, saveDoodle);

		editor.toolController.setTools([]);
		pen1 = new PenTool(editor, 'Pen', {
			color: Color4.white,
			thickness: 6,
			factory: makePressureSensitiveFreehandLineBuilder
		});
		pen2 = new PenTool(editor, 'Pen', {
			color: Color4.white,
			thickness: 10,
			factory: makePressureSensitiveFreehandLineBuilder
		});
		pen3 = new PenTool(editor, 'Pen', {
			color: Color4.white,
			thickness: 14,
			factory: makePressureSensitiveFreehandLineBuilder
		});
		eraser = new EraserTool(editor, 'Eraser', {
			mode: EraserMode.PartialStroke,
			thickness: 14
		});
		editor.toolController.addPrimaryTool(pen1);
		editor.toolController.addPrimaryTool(pen2);
		editor.toolController.addPrimaryTool(pen3);
		editor.toolController.addPrimaryTool(eraser);
		pen3.setEnabled(true);
	};

	$effect(() => {
		if (meQuery.isReady && initialUpdatesDone) {
			untrack(loadEditor);
		}
	});

	onDestroy(() => {
		editor?.remove();
	});

	let activeTool = $state<'pen1' | 'pen2' | 'pen3' | 'eraser'>('pen1');
</script>

<div class="canvas-parent" bind:this={canvas}></div>
<div class="tools">
	<button
		class="tool small"
		onclick={async () => {
			editor?.remove();
			await loadEditor(false);
			saveDoodle();
		}}><Trash2 size="16" /></button
	>
	<div class="right">
		<button
			class="tool small"
			class:active={activeTool === 'pen1'}
			onclick={() => {
				pen1?.setEnabled(true);
				activeTool = 'pen1';
			}}><PencilLine size="16" /></button
		>
		<button
			class="tool medium"
			class:active={activeTool === 'pen2'}
			onclick={() => {
				pen2?.setEnabled(true);
				activeTool = 'pen2';
			}}><PencilLine size="20" /></button
		>
		<button
			class="tool large"
			class:active={activeTool === 'pen3'}
			onclick={() => {
				pen3?.setEnabled(true);
				activeTool = 'pen3';
			}}><PencilLine size="24" /></button
		>
		<button
			class="tool eraser"
			class:active={activeTool === 'eraser'}
			onclick={() => {
				eraser?.setEnabled(true);
				activeTool = 'eraser';
			}}><Eraser size="16" /></button
		>
	</div>
</div>

<style lang="scss">
	.canvas-parent {
		border: 1px solid var(--sand-7);
		aspect-ratio: 1;
	}

	:global(:root .imageEditorContainer) {
		--background-color-1: transparent;
		width: 100%;
		height: 100%;
	}

	.tools {
		display: flex;
		justify-content: space-between;

		.right {
			display: flex;
			justify-content: flex-end;
		}
	}

	.tool {
		width: 48px;
		height: 48px;
		background: var(--sand-1);
		padding: 1px;
		outline-color: var(--blue-9);
		outline-offset: -1px;
		border: 1px solid var(--sand-7);
		border-top-width: 0;
		border-left-width: 0;
		display: block;
		font-size: 1rem;

		&.active {
			background: var(--blue-9);
			color: white;
		}

		&.small {
			border-left-width: 1px;
		}

		&:focus-within {
			outline-width: 2px;
			outline-style: solid;
			z-index: 2;
		}
	}
</style>
