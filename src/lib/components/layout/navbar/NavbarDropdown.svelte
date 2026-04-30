<script lang="ts">
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';

	interface Props {
		trigger: Snippet;
		children: Snippet;
		align?: 'left' | 'right';
		width?: string;
	}

	let { trigger, children, align = 'right', width = 'w-56' }: Props = $props();

	let open = $state(false);
	let triggerEl: HTMLDivElement;
	let menuEl: HTMLDivElement;

	function toggle() {
		open = !open;
	}

	export function close() {
		open = false;
	}

	$effect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (!triggerEl?.contains(e.target as Node) && !menuEl?.contains(e.target as Node)) {
				open = false;
			}
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		window.addEventListener('mousedown', handler);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('mousedown', handler);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<div class="relative">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div bind:this={triggerEl} onclick={toggle} class="contents">
		{@render trigger()}
	</div>

	{#if open}
		<div
			bind:this={menuEl}
			transition:scale={{ duration: 150, start: 0.96, easing: quintOut, opacity: 0 }}
			class="absolute {align === 'right' ? 'right-0' : 'left-0'} top-[calc(100%+8px)] {width}
			       bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/[0.08]
			       overflow-hidden z-50 origin-top-{align === 'right' ? 'right' : 'left'}"
			style="transform-origin: top {align === 'right' ? 'right' : 'left'}"
		>
			{@render children()}
		</div>
	{/if}
</div>