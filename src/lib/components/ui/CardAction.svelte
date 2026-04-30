<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Component } from 'svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';

	interface Props {
		icon: Component;
		confirmIcon?: Component;
		onAction: () => void;
		colorClass?: string;
		hoverClass?: string;
		title?: string;
	}

	let {
		icon: Icon,
		confirmIcon: ConfirmIcon,
		onAction,
		colorClass = 'text-slate-400',
		hoverClass = 'hover:text-primary-600',
		title
	}: Props = $props();

	let isConfirming = $state(false);
	let container: HTMLElement;

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		if (!ConfirmIcon) {
			onAction();
			return;
		}
		if (isConfirming) {
			onAction();
			isConfirming = false;
		} else {
			isConfirming = true;
		}
	}

	$effect(() => {
		if (isConfirming) {
			const onClickOutside = (e: MouseEvent) => {
				if (container && !container.contains(e.target as Node)) isConfirming = false;
			};
			window.addEventListener('click', onClickOutside);
			return () => window.removeEventListener('click', onClickOutside);
		}
	});
</script>

<div class="flex items-center justify-end h-8" bind:this={container}>
	{#if isConfirming && ConfirmIcon}
		<div transition:fade={{ duration: 100 }} class="flex items-center gap-2 pr-1">
			<button
				onclick={handleClick}
				class="p-1.5 rounded-lg transition-colors bg-white shadow-sm border border-slate-100 {colorClass}"
			>
				<ConfirmIcon class="w-4 h-4" />
			</button>
			<button
				onclick={(e) => {
					e.stopPropagation();
					isConfirming = false;
				}}
				class="p-1.5 text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-100 rounded-lg"
			>
				<CloseOutline class="w-4 h-4" />
			</button>
		</div>
	{:else}
		<button
			onclick={handleClick}
			{title}
			class="p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-40 hover:!opacity-100 {colorClass} {hoverClass} bg-transparent"
		>
			<Icon class="w-5 h-5" />
		</button>
	{/if}
</div>
