<script lang="ts">
	import { scale } from 'svelte/transition';
	import {
		ClockOutline,
		TagOutline,
		ArchiveOutline,
		EditOutline,
		RefreshOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import CardAction from '$lib/components/ui/CardAction.svelte';

	interface Props {
		pos: any;
		onEdit: (pos: any) => void;
		onToggleArchive: (id: string) => void;
		formatShelfLife: (m?: number, d?: number) => string;
	}

	let { pos, onEdit, onToggleArchive, formatShelfLife }: Props = $props();
</script>

<div
	transition:scale={{ duration: 200, start: 0.98 }}
	class="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-primary-200 transition-all duration-300 relative min-h-[220px] flex flex-col"
>
	<div class="absolute top-4 right-4 flex flex-col gap-1 z-20">
		<CardAction
			icon={pos.isArchived ? RefreshOutline : TrashBinOutline}
			confirmIcon={pos.isArchived ? RefreshOutline : TrashBinOutline}
			onAction={() => onToggleArchive(pos.id)}
			colorClass={pos.isArchived ? 'text-primary-600' : 'text-danger-600'}
			title="Архив"
		/>
		{#if !pos.isArchived}
			<CardAction
				icon={EditOutline}
				confirmIcon={EditOutline}
				onAction={() => onEdit(pos)}
				colorClass="text-slate-500"
				title="Редактировать"
			/>
		{/if}
	</div>

	<div class="flex items-start mb-4">
		<div
			class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/60 flex items-center justify-center text-primary-500 shadow-sm"
		>
			<ArchiveOutline class="w-6 h-6" />
		</div>
	</div>

	<div class="flex-1">
		<h3
			class="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2 pr-10"
		>
			{pos.name}
		</h3>
		<div class="flex flex-col gap-2 mt-4 text-sm text-slate-500">
			<div class="flex items-center gap-2">
				<ClockOutline class="w-4 h-4" />
				<span
					>Срок: <span class="font-semibold text-slate-700"
						>{formatShelfLife(pos.months, pos.days)}</span
					></span
				>
			</div>
		</div>
	</div>

	<div class="mt-5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
		<div
			class="h-full transition-all duration-500 {pos.isArchived
				? 'bg-slate-300'
				: 'bg-primary-500/20'} w-full"
		></div>
	</div>
</div>
