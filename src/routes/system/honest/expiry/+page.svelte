<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import {
		TagOutline,
		CalendarMonthOutline,
		ClockOutline,
		DownloadOutline,
		CheckOutline,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import HonestForm from '$lib/components/routes/system/honest/HonestForm.svelte';
	import { alert } from '$lib/state/alert.svelte';

	interface Product {
		id: string;
		name: string;
		months?: number;
		days?: number;
	}

	// Список товаров (берётся из позиций компании, пока мок)
	let products = $state<Product[]>([
		{ id: '1', name: 'Печенье "Овсяное"', months: 3, days: 0 },
		{ id: '2', name: 'Крекер классический', months: 0, days: 180 },
		{ id: '3', name: 'Вафли шоколадные', months: 6, days: 0 },
		{ id: '4', name: 'Пряник глазированный', months: 2, days: 15 },
		{ id: '5', name: 'Зефир ванильный', months: 1, days: 0 },
		{ id: '6', name: 'Мармелад фруктовый', months: 4, days: 0 }
	]);

	let searchQuery = $state('');
	let showArchived = $state(false);
	let selectedIds = $state<Set<string>>(new Set());
	let showForm = $state(false);
	let isExporting = $state(false);

	const filteredProducts = $derived(
		products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const selectedProducts = $derived(products.filter((p) => selectedIds.has(p.id)));

	const allSelected = $derived(
		filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.has(p.id))
	);

	const someSelected = $derived(
		filteredProducts.some((p) => selectedIds.has(p.id)) && !allSelected
	);

	function toggleSelect(id: string) {
		const next = new Set(selectedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedIds = next;
	}

	function toggleAll() {
		if (allSelected) {
			const next = new Set(selectedIds);
			filteredProducts.forEach((p) => next.delete(p.id));
			selectedIds = next;
		} else {
			const next = new Set(selectedIds);
			filteredProducts.forEach((p) => next.add(p.id));
			selectedIds = next;
		}
	}

	function clearSelection() {
		selectedIds = new Set();
		showForm = false;
	}

	function openForm() {
		if (selectedIds.size === 0) return;
		showForm = true;
	}

	async function handleExport(data: {
		startDate: string;
		entries: { id: string; expiryDate: string }[];
	}) {
		isExporting = true;
		// TODO: отправить на бек и получить Excel
		await new Promise((r) => setTimeout(r, 1200));
		isExporting = false;
		alert.show('Excel успешно сформирован');
		clearSelection();
	}

	const formatShelfLife = (m: number = 0, d: number = 0) => {
		const parts = [];
		if (m > 0) parts.push(`${m} мес.`);
		if (d > 0) parts.push(`${d} дн.`);
		return parts.join(' ') || 'не задан';
	};
</script>

<div class="max-w-7xl mx-auto py-10 px-4 text-slate-900">
	<header class="flex items-start justify-between gap-4 mb-10 h-16">
		<div>
			<h1 class="text-3xl font-light text-primary-500 tracking-tight">Сроки годности</h1>
			<p class="text-slate-500 mt-1">Честный знак — формирование Excel по товарам</p>
		</div>

		{#if selectedIds.size > 0 && !showForm}
			<button
				transition:scale={{ duration: 150 }}
				onclick={openForm}
				class="btn-primary flex items-center gap-2 !h-12 px-6 shadow-lg shadow-primary-500/20"
			>
				<CalendarMonthOutline class="w-5 h-5" />
				Задать даты ({selectedIds.size})
			</button>
		{/if}
	</header>

	<!-- Форма задания дат -->
	{#if showForm && selectedIds.size > 0}
		<HonestForm
			products={selectedProducts}
			{isExporting}
			onExport={handleExport}
			onClose={clearSelection}
		/>
	{/if}

	<!-- Поиск -->
	<div class="flex gap-3 mb-6">
		<div class="relative flex-1">
			<input
				bind:value={searchQuery}
				type="text"
				placeholder="Поиск по названию товара..."
				class="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 h-13 focus:ring-4 focus:ring-primary-100 focus:border-primary-300 outline-none transition-all shadow-sm shadow-slate-100"
			/>
			<TagOutline class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
		</div>
	</div>

	<!-- Таблица товаров -->
	<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
		<!-- Заголовок таблицы -->
		<div class="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
			<!-- Чекбокс "выбрать все" -->
			<button
				onclick={toggleAll}
				class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
				{allSelected
					? 'bg-primary-500 border-primary-500'
					: someSelected
						? 'bg-primary-100 border-primary-400'
						: 'border-slate-300 hover:border-primary-400'}"
			>
				{#if allSelected}
					<CheckOutline class="w-3 h-3 text-white" />
				{:else if someSelected}
					<span class="w-2 h-0.5 bg-primary-500 block rounded-full"></span>
				{/if}
			</button>

			<span class="text-xs font-bold text-slate-500 uppercase tracking-widest flex-1">
				Товар
				{#if selectedIds.size > 0}
					<span class="ml-2 text-primary-500 normal-case font-semibold">
						· выбрано {selectedIds.size}
					</span>
				{/if}
			</span>
			<span
				class="text-xs font-bold text-slate-500 uppercase tracking-widest w-40 text-right hidden sm:block"
			>
				Срок хранения
			</span>
		</div>

		<!-- Строки товаров -->
		{#if filteredProducts.length === 0}
			<div class="py-20 text-center">
				<ExclamationCircleOutline class="w-10 h-10 text-slate-300 mx-auto mb-3" />
				<p class="text-slate-400">Товары не найдены</p>
			</div>
		{:else}
			{#each filteredProducts as product (product.id)}
				<div
					animate:flip={{ duration: 300, easing: quintOut }}
					class="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors cursor-pointer group"
					onclick={() => toggleSelect(product.id)}
					role="row"
					tabindex="0"
					onkeydown={(e) => e.key === ' ' && toggleSelect(product.id)}
				>
					<!-- Чекбокс -->
					<div
						class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
						{selectedIds.has(product.id)
							? 'bg-primary-500 border-primary-500'
							: 'border-slate-300 group-hover:border-primary-400'}"
					>
						{#if selectedIds.has(product.id)}
							<CheckOutline class="w-3 h-3 text-white" />
						{/if}
					</div>

					<!-- Иконка + название -->
					<div class="flex items-center gap-3 flex-1 min-w-0">
						<div
							class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
							{selectedIds.has(product.id)
								? 'bg-primary-100 text-primary-600'
								: 'bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500'}"
						>
							<TagOutline class="w-4 h-4" />
						</div>
						<span
							class="text-sm font-medium text-slate-800 truncate transition-colors
							{selectedIds.has(product.id) ? 'text-primary-700' : ''}"
						>
							{product.name}
						</span>
					</div>

					<!-- Срок хранения -->
					<div
						class="flex items-center gap-1.5 text-sm text-slate-500 w-40 justify-end hidden sm:flex shrink-0"
					>
						<ClockOutline class="w-4 h-4 text-slate-400" />
						<span>{formatShelfLife(product.months, product.days)}</span>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Нижний бар выбора -->
	{#if selectedIds.size > 0}
		<div
			transition:scale={{ duration: 200, start: 0.97 }}
			class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-primary-500 text-white rounded-2xl px-6 py-3.5 flex items-center gap-6 shadow-2xl shadow-primary-500/30"
		>
			<span class="text-sm font-semibold">Выбрано: {selectedIds.size}</span>
			<div class="w-px h-5 bg-primary-400"></div>
			<button
				onclick={openForm}
				class="flex items-center gap-2 text-sm font-semibold hover:text-primary-100 transition-colors"
			>
				<CalendarMonthOutline class="w-4 h-4" />
				Задать даты
			</button>
			<button
				onclick={clearSelection}
				class="text-sm text-primary-300 hover:text-white transition-colors"
			>
				Снять выбор
			</button>
		</div>
	{/if}
</div>
