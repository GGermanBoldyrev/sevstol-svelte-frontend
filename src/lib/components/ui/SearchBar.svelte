<script lang="ts">
	import { SearchOutline, CloseOutline, ArchiveOutline } from 'flowbite-svelte-icons';
	import { scale } from 'svelte/transition';

	interface Props {
		value: string;
		showArchived: boolean;
		placeholder?: string;
		onToggleArchive: () => void;
	}

	let { value = $bindable(), showArchived, placeholder, onToggleArchive }: Props = $props();
</script>

<div class="flex gap-3 mb-8">
	<div class="relative flex-1">
		<SearchOutline class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
		<input
			bind:value
			type="text"
			{placeholder}
			class="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-12 h-13 focus:ring-4 focus:ring-primary-100 focus:border-primary-300 outline-none transition-all shadow-sm shadow-slate-100"
		/>
		{#if value}
			<button
				transition:scale={{ duration: 150 }}
				onclick={() => (value = '')}
				class="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary-500 transition-colors"
			>
				<CloseOutline class="w-5 h-5" />
			</button>
		{/if}
	</div>

	<button
		onclick={onToggleArchive}
		class="w-13 h-13 shrink-0 rounded-2xl border transition-all flex items-center justify-center shadow-sm
		{showArchived
			? 'bg-primary-600 text-white border-primary-600 shadow-primary-500/20'
			: 'bg-white text-slate-400 border-slate-200 hover:border-primary-200 hover:text-primary-500'}"
		title={showArchived ? 'Показать активные' : 'Показать архив'}
	>
		<ArchiveOutline class="w-6 h-6" />
	</button>
</div>
