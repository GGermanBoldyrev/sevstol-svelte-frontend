<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { CheckOutline, CloseOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { alert } from '$lib/state/alert.svelte';
</script>

{#if alert.current.show}
	<div
		transition:fly={{ y: -16, duration: 350, easing: quintOut }}
		class="fixed top-6 right-6 z-[200] flex items-start gap-3 max-w-sm pointer-events-auto"
		role="alert"
		aria-live="polite"
	>
		{#if alert.current.type === 'success'}
			<!-- Success: зелёный квадрат с галочкой, без текста -->
			<div
				in:scale={{ duration: 250, start: 0.8, easing: quintOut }}
				class="w-12 h-12 rounded-xl bg-success-500 flex items-center justify-center shadow-lg shadow-success-500/30 shrink-0"
			>
				<CheckOutline class="w-6 h-6 text-white" />
			</div>
		{:else}
			<!-- Error: карточка с текстом -->
			<div
				in:fly={{ x: 20, duration: 300, easing: quintOut }}
				class="flex items-start gap-3 bg-white border border-danger-200 rounded-2xl px-4 py-3.5 shadow-xl shadow-danger-500/10"
			>
				<div
					class="w-8 h-8 rounded-lg bg-danger-50 flex items-center justify-center shrink-0 mt-0.5"
				>
					<ExclamationCircleOutline class="w-4 h-4 text-danger-500" />
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-semibold text-slate-800">Ошибка</p>
					<p class="text-sm text-slate-500 mt-0.5 leading-relaxed">{alert.current.text}</p>
				</div>
				<button
					onclick={() => alert.hide()}
					class="p-1 text-slate-300 hover:text-slate-500 transition-colors shrink-0"
				>
					<CloseOutline class="w-4 h-4" />
				</button>
			</div>
		{/if}
	</div>
{/if}
