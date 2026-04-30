<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { PlusOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { alert } from '$lib/state/alert.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import PositionForm from '$lib/components/routes/system/positions/PositionForm.svelte';
	import PositionCard from '$lib/components/routes/system/positions/PositionCard.svelte';

	interface Position {
		id: string;
		name: string;
		months?: number;
		days?: number;
		isArchived: boolean;
	}

	let positions = $state<Position[]>([
		{
			id: '1',
			name: 'Печенье "Овсяное"',
			months: 3,
			days: 0,
			isArchived: false
		},
		{
			id: '2',
			name: 'Крекер классический',
			months: 0,
			days: 180,
			isArchived: false
		}
	]);

	let searchQuery = $state('');
	let showArchived = $state(false);

	const emptyForm = { name: '', months: undefined, days: undefined };
	let showAddForm = $state(false);
	let editingId = $state<string | null>(null);
	let isSaving = $state(false);

	let formData = $state({ ...emptyForm });
	let savedVersion = $state({ ...emptyForm });

	const filteredPositions = $derived(
		positions.filter(
			(p) =>
				p.isArchived === showArchived && p.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function startAddNew() {
		resetForm();
		showAddForm = true;
		showArchived = false;
	}

	function startEdit(pos: Position) {
		editingId = pos.id;
		const dataToEdit = {
			name: pos.name,
			months: pos.months,
			days: pos.days
		};
		formData = { ...dataToEdit };
		savedVersion = { ...dataToEdit };
		showAddForm = true;
		showArchived = false;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function resetForm() {
		formData = { ...emptyForm };
		savedVersion = { ...emptyForm };
		editingId = null;
		showAddForm = false;
	}

	function handleCancelChanges() {
		formData = { ...savedVersion };
	}

	async function handleSave() {
		console.log('Попытка сохранения...', { editingId, formData });

		if (!formData.name || formData.name.trim().length < 3) {
			alert.show('Название слишком короткое', 'error');
			return;
		}

		isSaving = true;
		try {
			// Имитируем задержку сети
			await new Promise((r) => setTimeout(r, 800));

			if (editingId) {
				console.log('Режим редактирования. ID:', editingId);
				const idx = positions.findIndex((p) => p.id === editingId);

				if (idx !== -1) {
					// В Svelte 5 для реактивности массива лучше заменять объект целиком
					positions[idx] = {
						...positions[idx],
						...formData,
						id: editingId // на всякий случай фиксируем ID
					};
					alert.show('Изменения сохранены', 'success');
				} else {
					console.error('Позиция с таким ID не найдена в массиве');
				}
			} else {
				console.log('Режим создания новой позиции');
				const newPos: Position = {
					id: Math.random().toString(36).substring(2, 9),
					name: formData.name,
					months: formData.months || 0,
					days: formData.days || 0,
					isArchived: false
				};
				// Важно: в Svelte 5 positions = [...positions, newPos] работает надежнее
				positions = [newPos, ...positions];
				alert.show('Позиция успешно создана', 'success');
			}

			console.log('Обновленный список позиций:', positions);
			resetForm();
		} catch (e) {
			console.error('Ошибка в handleSave:', e);
			alert.show('Ошибка при сохранении', 'error');
		} finally {
			isSaving = false;
		}
	}

	function toggleArchive(id: string) {
		const idx = positions.findIndex((p) => p.id === id);
		if (idx !== -1) {
			positions[idx].isArchived = !positions[idx].isArchived;
			alert.show(
				positions[idx].isArchived ? 'Позиция перенесена в архив' : 'Позиция восстановлена'
			);
		}
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
			<h1 class="text-3xl font-light text-primary-500 tracking-tight">Позиции компании</h1>
			<p class="text-slate-500 mt-1">Управление каталогом и сроками хранения</p>
		</div>

		{#if !showAddForm}
			<button
				transition:scale={{ duration: 150 }}
				onclick={startAddNew}
				class="btn-primary flex items-center gap-2 !h-12 px-6 shadow-lg shadow-primary-500/20"
			>
				<PlusOutline class="w-5 h-5" />
				Добавить позицию
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
		<PositionForm
			bind:data={formData}
			savedData={savedVersion}
			{editingId}
			{isSaving}
			onSave={handleSave}
			onCancel={handleCancelChanges}
			onClose={resetForm}
		/>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredPositions as pos (pos.id)}
			<div animate:flip={{ duration: 400, easing: quintOut }}>
				<PositionCard {pos} {formatShelfLife} onEdit={startEdit} onToggleArchive={toggleArchive} />
			</div>
		{:else}
			<div
				in:scale={{ duration: 200, delay: 100 }}
				class="col-span-full py-20 text-center card bg-slate-50/50 border-dashed border-2"
			>
				<ExclamationCircleOutline class="w-12 h-12 text-slate-300 mx-auto mb-4" />
				<p class="text-slate-500 font-medium">
					{showArchived ? 'Архив пуст' : 'Активных позиций не найдено'}
				</p>
			</div>
		{/each}
	</div>
</div>

<style>
	:global(input::-webkit-outer-spin-button),
	:global(input::-webkit-inner-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}
	:global(body) {
		padding-bottom: 100px;
	}
</style>
