<script lang="ts">
	import { TrashBinOutline, RefreshOutline, CloseOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';

	interface Props {
		isArchived: boolean;
		onConfirm: () => void;
	}

	let { isArchived, onConfirm }: Props = $props();
	let isConfirming = $state(false);
	let container: HTMLElement;

	function handleConfirm(e: MouseEvent) {
		e.stopPropagation();
		if (isConfirming) {
			onConfirm();
			isConfirming = false;
		} else {
			isConfirming = true;
		}
	}

	// Click outside logic
	$effect(() => {
		if (isConfirming) {
			const clickOutside = (e: MouseEvent) => {
				if (container && !container.contains(e.target as Node)) isConfirming = false;
			};
			window.addEventListener('click', clickOutside);
			return () => window.removeEventListener('click', clickOutside);
		}
	});
</script>

<div class="flex items-center gap-1 h-10" bind:this={container}>
	{#if isConfirming}
		<div transition:fly={{ x: 10, duration: 200 }} class="flex items-center gap-1">
			<button
				onclick={handleConfirm}
				class="p-2 rounded-lg transition-colors {isArchived
					? 'bg-primary-50 text-primary-600'
					: 'bg-danger-50 text-danger-600'}"
			>
				{#if isArchived}<RefreshOutline class="w-5 h-5" />{:else}<TrashBinOutline
						class="w-5 h-5"
					/>{/if}
			</button>
			<button
				onclick={(e) => {
					e.stopPropagation();
					isConfirming = false;
				}}
				class="p-2 text-slate-400 bg-slate-50 rounded-lg hover:text-slate-600 transition-colors"
			>
				<CloseOutline class="w-5 h-5" />
			</button>
		</div>
	{:else}
		<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
			<button
				onclick={handleConfirm}
				class="p-2 rounded-lg transition-all {isArchived
					? 'text-primary-500 hover:bg-primary-50'
					: 'text-slate-400 hover:text-danger-600 hover:bg-danger-50'}"
			>
				{#if isArchived}<RefreshOutline class="w-5 h-5" />{:else}<TrashBinOutline
						class="w-5 h-5"
					/>{/if}
			</button>
		</div>
	{/if}
</div>
