<script lang="ts">
	import { slide } from 'svelte/transition';
	import { CloseOutline, DownloadOutline, CalendarMonthOutline } from 'flowbite-svelte-icons';
	import LoadingButton from '$lib/components/ui/LoadingButton.svelte';

	interface Product {
		id: string;
		name: string;
		months?: number;
		days?: number;
	}

	interface ExportEntry {
		id: string;
		expiryDate: string;
	}

	interface Props {
		products: Product[];
		isExporting: boolean;
		onExport: (data: { startDate: string; entries: ExportEntry[] }) => void;
		onClose: () => void;
	}

	let { products, isExporting, onExport, onClose }: Props = $props();

	// Начальная дата производства (одна для всех или задаётся на каждый товар)
	let useOneDate = $state(true);
	let globalStartDate = $state('');

	// Индивидуальные даты: id -> startDate
	let individualDates = $state<Record<string, string>>(
		Object.fromEntries(products.map((p) => [p.id, '']))
	);

	const today = new Date().toISOString().split('T')[0];

	// Считаем дату истечения срока годности по startDate + months/days
	function calcExpiry(startDate: string, months: number = 0, days: number = 0): string {
		if (!startDate) return '—';
		const d = new Date(startDate);
		d.setMonth(d.getMonth() + months);
		d.setDate(d.getDate() + days);
		return d.toLocaleDateString('ru-RU');
	}

	function getStartDate(product: Product): string {
		return useOneDate ? globalStartDate : individualDates[product.id] || '';
	}

	const isValid = $derived(() => {
		if (useOneDate) return globalStartDate !== '';
		return products.every((p) => individualDates[p.id] !== '');
	});

	function handleExport() {
		const entries: ExportEntry[] = products.map((p) => {
			const start = getStartDate(p);
			const d = new Date(start);
			d.setMonth(d.getMonth() + (p.months || 0));
			d.setDate(d.getDate() + (p.days || 0));
			return { id: p.id, expiryDate: d.toISOString().split('T')[0] };
		});
		onExport({ startDate: globalStartDate, entries });
	}
</script>

<div
	transition:slide
	class="card mb-8 border-primary-100 bg-primary-50/20 shadow-lg shadow-primary-500/5"
>
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-3">
			<div class="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
				<CalendarMonthOutline class="w-5 h-5 text-primary-600" />
			</div>
			<div>
				<h3 class="text-base font-bold text-slate-800">Даты производства</h3>
				<p class="text-xs text-slate-500 mt-0.5">Выбрано товаров: {products.length}</p>
			</div>
		</div>
		<button onclick={onClose} class="text-slate-400 hover:text-slate-600 transition-colors">
			<CloseOutline class="w-5 h-5" />
		</button>
	</div>

	<!-- Переключатель режима дат -->
	<div class="flex items-center gap-3 mb-6">
		<button
			onclick={() => (useOneDate = true)}
			class="px-4 py-2 rounded-xl text-sm font-medium transition-all
			{useOneDate
				? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
				: 'bg-white border border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-600'}"
		>
			Одна дата для всех
		</button>
		<button
			onclick={() => (useOneDate = false)}
			class="px-4 py-2 rounded-xl text-sm font-medium transition-all
			{!useOneDate
				? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
				: 'bg-white border border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-600'}"
		>
			Для каждого товара
		</button>
	</div>

	{#if useOneDate}
		<!-- Единая дата производства -->
		<div class="flex items-end gap-6 mb-6">
			<div class="space-y-1.5">
				<label class="input-label" for="global-date">
					Дата производства <span class="text-danger-500">*</span>
				</label>
				<input
					id="global-date"
					type="date"
					bind:value={globalStartDate}
					max={today}
					class="input w-52"
				/>
			</div>
		</div>

		<!-- Превью сроков годности -->
		{#if globalStartDate}
			<div class="space-y-2">
				{#each products as product}
					<div
						class="flex items-center justify-between py-2.5 px-4 bg-white rounded-xl border border-slate-100"
					>
						<span class="text-sm text-slate-700 font-medium truncate flex-1">{product.name}</span>
						<div class="text-sm text-slate-500 shrink-0 ml-4">
							Годен до: <span class="font-semibold text-success-600">
								{calcExpiry(globalStartDate, product.months, product.days)}
							</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<!-- Индивидуальные даты -->
		<div class="space-y-3">
			{#each products as product}
				<div
					class="flex items-center gap-4 py-2.5 px-4 bg-white rounded-xl border border-slate-100"
				>
					<span class="text-sm text-slate-700 font-medium flex-1 truncate">{product.name}</span>
					<input
						type="date"
						bind:value={individualDates[product.id]}
						max={today}
						class="input !w-44 shrink-0"
					/>
					{#if individualDates[product.id]}
						<span class="text-sm text-success-600 font-semibold w-28 text-right shrink-0">
							{calcExpiry(individualDates[product.id], product.months, product.days)}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Кнопка экспорта -->
	<div class="flex items-center justify-end gap-4 mt-6 pt-5 border-t border-slate-200/50">
		<button
			onclick={onClose}
			class="text-xs font-bold text-slate-400 hover:text-danger-500 uppercase tracking-widest cursor-pointer transition-colors"
		>
			Отмена
		</button>
		<LoadingButton onclick={handleExport} loading={isExporting} disabled={!isValid()}>
			<DownloadOutline class="w-4 h-4" />
			Сформировать Excel
		</LoadingButton>
	</div>
</div>
