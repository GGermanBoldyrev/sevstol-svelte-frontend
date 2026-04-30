<script lang="ts">
	import { slide, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import {
		PlusOutline,
		ClockOutline,
		TagOutline,
		ArchiveOutline,
		CloseOutline,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';

	import { alert } from '$lib/state/alert.svelte';
	import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ActionConfirm from '$lib/components/ui/ActionConfirm.svelte';

	interface Position {
		id: string;
		name: string;
		months?: number;
		days?: number;
		category: string;
		isArchived: boolean;
	}

	let positions = $state<Position[]>([
		{
			id: '1',
			name: 'Печенье "Овсяное"',
			months: 3,
			days: 0,
			category: 'Выпечка',
			isArchived: false
		},
		{
			id: '2',
			name: 'Крекер классический',
			months: 0,
			days: 180,
			category: 'Снеки',
			isArchived: false
		}
	]);

	let searchQuery = $state('');
	let showAddForm = $state(false);
	let isSaving = $state(false);
	let showArchived = $state(false);

	let newItem = $state({
		name: '',
		months: undefined as number | undefined,
		days: undefined as number | undefined,
		category: 'Выпечка'
	});

	// --- Logic ---
	const filteredPositions = $derived(
		positions.filter(
			(p) =>
				p.isArchived === showArchived && p.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const validation = $derived({
		nameTooShort: newItem.name.length > 0 && newItem.name.trim().length < 3,
		namePatternInvalid:
			newItem.name.length > 0 && !/^[А-ЯЁа-яёA-Za-z0-9\s"'-]+$/.test(newItem.name),

		monthsInvalid: newItem.months !== undefined && newItem.months < 0,
		daysInvalid: newItem.days !== undefined && newItem.days < 0,

		timeMissing: !newItem.months && !newItem.days,

		get isValid() {
			return (
				newItem.name.trim().length >= 3 &&
				!this.namePatternInvalid &&
				!this.monthsInvalid &&
				!this.daysInvalid &&
				!this.timeMissing
			);
		}
	});

	const isDirty = $derived(
		newItem.name.length > 0 || newItem.months !== undefined || newItem.days !== undefined
	);

	function toggleArchive(id: string) {
		const idx = positions.findIndex((p) => p.id === id);
		positions[idx].isArchived = !positions[idx].isArchived;
		alert.show(positions[idx].isArchived ? 'Перенесено в архив' : 'Позиция восстановлена');
	}

	async function addPosition() {
		if (!validation.isValid) return;
		isSaving = true;
		await new Promise((r) => setTimeout(r, 600));
		positions = [{ id: Math.random().toString(), ...newItem, isArchived: false }, ...positions];
		newItem = { name: '', months: undefined, days: undefined, category: 'Выпечка' };
		showAddForm = false;
		isSaving = false;
		alert.show('Позиция создана успешно');
	}

	function formatShelfLife(m: number = 0, d: number = 0) {
		let parts = [];
		if (m > 0) parts.push(`${m} мес.`);
		if (d > 0) parts.push(`${d} дн.`);
		return parts.join(' ') || 'не задан';
	}
</script>

<div class="max-w-7xl mx-auto py-10 px-4 text-slate-900">
	<header class="flex items-start justify-between gap-4 mb-10">
		<div>
			<h1 class="text-3xl font-light text-primary-500 tracking-tight">Позиции компании</h1>
			<p class="text-slate-500 mt-1">Управление каталогом и сроками хранения</p>
		</div>

		{#if !showAddForm}
			<button
				transition:scale={{ duration: 150 }}
				onclick={() => {
					showAddForm = true;
					showArchived = false;
				}}
				class="btn-primary flex items-center gap-2 !h-12 px-6 shadow-lg shadow-primary-500/20"
			>
				<PlusOutline class="w-5 h-5" /> Добавить позицию
			</button>
		{/if}
	</header>

	<SearchBar
		bind:value={searchQuery}
		{showArchived}
		placeholder={showArchived ? 'Поиск в архиве...' : 'Поиск по названию...'}
		onToggleArchive={() => (showArchived = !showArchived)}
	/>

	{#if showAddForm}
		<div
			transition:slide={{ duration: 300, easing: quintOut }}
			class="card mb-10 border-primary-100 bg-primary-50/20 shadow-lg"
		>
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-lg font-bold text-slate-800">Создание позиции</h3>
				<button
					onclick={() => (showAddForm = false)}
					class="text-slate-400 hover:text-slate-600 transition-colors"
				>
					<CloseOutline class="w-6 h-6" />
				</button>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				<!-- Название -->
				<div class="lg:col-span-6 space-y-1.5">
					<label class="input-label" for="n"
						>Название товара <span class="text-danger-500">*</span></label
					>
					<input
						id="n"
						bind:value={newItem.name}
						class="input {validation.nameTooShort || validation.namePatternInvalid
							? 'border-danger-500 !ring-danger-100'
							: ''}"
						placeholder="Например: Печенье кунжутное"
					/>
					<div class="h-5">
						{#if validation.nameTooShort}
							<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
								transition:slide
							>
								Минимум 3 символа
							</p>
						{:else if validation.namePatternInvalid}
							<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
								transition:slide
							>
								Недопустимые символы
							</p>
						{/if}
					</div>
				</div>

				<!-- Месяцы -->
				<div class="lg:col-span-3 space-y-1.5">
					<label class="input-label" for="m">Месяцев</label>
					<input
						id="m"
						type="number"
						min="0"
						bind:value={newItem.months}
						placeholder="0"
						class="input {validation.monthsInvalid ? 'border-danger-500 !ring-danger-100' : ''}"
					/>
					<div class="h-5">
						{#if validation.monthsInvalid}
							<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
								transition:slide
							>
								Не может быть меньше 0
							</p>
						{/if}
					</div>
				</div>

				<!-- Дни -->
				<div class="lg:col-span-3 space-y-1.5">
					<label class="input-label" for="d">Дней</label>
					<input
						id="d"
						type="number"
						min="0"
						bind:value={newItem.days}
						placeholder="0"
						class="input {validation.daysInvalid ? 'border-danger-500 !ring-danger-100' : ''}"
					/>
					<div class="h-5">
						{#if validation.daysInvalid}
							<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
								transition:slide
							>
								Не может быть меньше 0
							</p>
						{/if}
					</div>
				</div>
			</div>

			{#if isDirty}
				<div
					transition:slide={{ duration: 200 }}
					class="flex items-center justify-end gap-6 mt-4 pt-6 border-t border-slate-200/50"
				>
					<button
						onclick={() =>
							(newItem = { name: '', months: undefined, days: undefined, category: 'Выпечка' })}
						class="text-xs font-bold text-slate-400 hover:text-danger-500 uppercase tracking-widest transition-colors cursor-pointer"
					>
						Очистить
					</button>
					<LoadingButton onclick={addPosition} loading={isSaving} disabled={!validation.isValid}>
						Создать позицию
					</LoadingButton>
				</div>
			{/if}
		</div>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredPositions as pos (pos.id)}
			<div
				animate:flip={{ duration: 400, easing: quintOut }}
				transition:scale={{ duration: 200, start: 0.98 }}
				class="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-primary-200 transition-all duration-300 relative"
			>
				<div class="flex items-start justify-between mb-4">
					<div
						class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/60 flex items-center justify-center text-primary-500 shadow-sm"
					>
						<ArchiveOutline class="w-6 h-6" />
					</div>
					<ActionConfirm isArchived={pos.isArchived} onConfirm={() => toggleArchive(pos.id)} />
				</div>

				<h3
					class="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1"
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
					<div class="flex items-center gap-2">
						<TagOutline class="w-4 h-4" />
						<span
							class="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-slate-600"
							>{pos.category}</span
						>
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
		{:else}
			<div
				in:scale={{ duration: 200, delay: 100 }}
				class="col-span-full py-20 text-center card bg-slate-50/50 border-dashed border-2"
			>
				<ExclamationCircleOutline class="w-12 h-12 text-slate-300 mx-auto mb-4" />
				<p class="text-slate-500 font-medium">
					{showArchived ? 'Архив пуст' : 'Позиций не найдено'}
				</p>
			</div>
		{/each}
	</div>
</div>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
