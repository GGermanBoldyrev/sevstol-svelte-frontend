<script lang="ts">
	import { slide } from 'svelte/transition';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import LoadingButton from '$lib/components/ui/LoadingButton.svelte';

	interface Props {
		data: { name: string; months?: number; days?: number; category: string };
		savedData: any;
		editingId: string | null;
		isSaving: boolean;
		onSave: () => void;
		onCancel: () => void;
		onClose: () => void;
	}

	let {
		data = $bindable(),
		savedData,
		editingId,
		isSaving,
		onSave,
		onCancel,
		onClose
	}: Props = $props();

	const validation = $derived({
		nameTooShort: data.name.length > 0 && data.name.trim().length < 3,
		namePatternInvalid: data.name.length > 0 && !/^[А-ЯЁа-яёA-Za-z0-9\s"'-]+$/.test(data.name),
		timeMissing: (data.months || 0) === 0 && (data.days || 0) === 0,
		get isValid() {
			return data.name.trim().length >= 3 && !this.namePatternInvalid && !this.timeMissing;
		}
	});

	const isDirty = $derived(
		data.name !== savedData.name || data.months !== savedData.months || data.days !== savedData.days
	);

	function handleNumberKeydown(e: KeyboardEvent) {
		if (['-', '.', ',', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
	}

	function handleNumberInput(e: Event & { currentTarget: HTMLInputElement }) {
		let val = e.currentTarget.value;
		if (val.length > 1 && val.startsWith('0')) {
			e.currentTarget.value = val.replace(/^0+/, '');
		}
	}
</script>

<div
	transition:slide
	class="card mb-10 border-primary-100 bg-primary-50/20 shadow-lg shadow-primary-500/5"
>
	<div class="flex items-center justify-between mb-6">
		<h3 class="text-lg font-bold text-slate-800">
			{editingId ? 'Редактирование' : 'Новая позиция'}
		</h3>
		<button onclick={onClose} class="text-slate-400 hover:text-slate-600"
			><CloseOutline class="w-6 h-6" /></button
		>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
		<div class="lg:col-span-6 space-y-1.5">
			<label class="input-label" for="n"
				>Название товара <span class="text-danger-500">*</span></label
			>
			<input
				id="n"
				bind:value={data.name}
				class="input {validation.nameTooShort ? 'border-danger-500' : ''}"
				placeholder="Введите название..."
			/>
			<div class="h-5">
				{#if validation.nameTooShort}<p class="text-[10px] text-danger-500 font-bold uppercase">
						Минимум 3 символа
					</p>{/if}
			</div>
		</div>

		<div class="lg:col-span-3 space-y-1.5">
			<label class="input-label" for="m">Месяцев</label>
			<input
				id="m"
				type="number"
				min="0"
				onkeydown={handleNumberKeydown}
				oninput={handleNumberInput}
				bind:value={data.months}
				placeholder="0"
				class="input"
			/>
		</div>

		<div class="lg:col-span-3 space-y-1.5">
			<label class="input-label" for="d">Дней</label>
			<input
				id="d"
				type="number"
				min="0"
				onkeydown={handleNumberKeydown}
				oninput={handleNumberInput}
				bind:value={data.days}
				placeholder="0"
				class="input"
			/>
		</div>
	</div>

	{#if isDirty}
		<div
			transition:slide
			class="flex items-center justify-end gap-6 mt-4 pt-6 border-t border-slate-200/50"
		>
			<button
				onclick={onCancel}
				class="text-xs font-bold text-slate-400 hover:text-danger-500 uppercase tracking-widest cursor-pointer"
			>
				{editingId ? 'Вернуть' : 'Очистить'}
			</button>
			<LoadingButton onclick={onSave} loading={isSaving} disabled={!validation.isValid}>
				{editingId ? 'Сохранить изменения' : 'Создать позицию'}
			</LoadingButton>
		</div>
	{/if}
</div>
