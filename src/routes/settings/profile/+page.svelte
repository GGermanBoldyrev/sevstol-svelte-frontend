<script lang="ts">
	import { slide } from 'svelte/transition';
	import { UserOutline, MailBoxOutline, LockOutline } from 'flowbite-svelte-icons';
	import { alert } from '$lib/state/alert.svelte';
	import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
	import AppAlert from '$lib/components/ui/AppAlert.svelte';

	let savedVersion = $state({
		firstName: 'Герман',
		lastName: 'Болдырев',
		middleName: 'Александрович',
		email: 'german@example.com'
	});

	let formData = $state({ ...savedVersion });
	let passwordData = $state({ newPassword: '', confirmPassword: '' });
	let isSaving = $state(false);

	const nameRegex = /^[А-ЯЁа-яёA-Za-z\s-]+$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const userInitials = $derived(formData.firstName?.[0]?.toUpperCase() || '?');

	const isDirty = $derived(
		formData.firstName !== savedVersion.firstName ||
			formData.lastName !== savedVersion.lastName ||
			formData.middleName !== savedVersion.middleName ||
			formData.email !== savedVersion.email ||
			passwordData.newPassword !== ''
	);

	const validation = $derived({
		firstNameInvalid: formData.firstName.trim().length === 0 || !nameRegex.test(formData.firstName),
		lastNameInvalid: formData.lastName.length > 0 && !nameRegex.test(formData.lastName),
		middleNameInvalid: formData.middleName.length > 0 && !nameRegex.test(formData.middleName),
		emailInvalid: formData.email.length > 0 && !emailRegex.test(formData.email),
		passwordsMismatch:
			passwordData.newPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword,
		get isValid() {
			return (
				!this.firstNameInvalid &&
				!this.lastNameInvalid &&
				!this.middleNameInvalid &&
				!this.emailInvalid &&
				!this.passwordsMismatch
			);
		}
	});

	function handleCancel() {
		formData = { ...savedVersion };
		passwordData = { newPassword: '', confirmPassword: '' };
	}

	async function handleSave() {
		if (!validation.isValid || !isDirty) return;
		isSaving = true;
		await new Promise((r) => setTimeout(r, 1000));
		savedVersion = { ...formData };
		passwordData = { newPassword: '', confirmPassword: '' };
		isSaving = false;
		alert.show('Изменения успешно применены');
	}
</script>

<AppAlert />

<div class="max-w-3xl mx-auto py-10 px-4">
	<header class="mb-10">
		<h1 class="text-3xl font-light text-primary-500 tracking-tight">Настройки профиля</h1>
		<p class="text-slate-500 mt-2">Управляйте личными данными и безопасностью</p>
	</header>

	<div class="space-y-6">
		<section
			class="card flex flex-col md:flex-row items-center gap-8 shadow-sm shadow-slate-200/50"
		>
			<div class="relative shrink-0">
				<div
					class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/60 flex items-center justify-center text-primary-600 text-4xl font-bold shadow-inner"
				>
					{userInitials}
				</div>
				<div
					class="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm text-slate-400"
				>
					<UserOutline class="w-4 h-4" />
				</div>
			</div>
			<div>
				<h3 class="text-lg font-semibold text-slate-800">Фото профиля</h3>
				<p class="text-sm text-slate-500 max-w-xs">Иконка генерируется автоматически по имени.</p>
			</div>
		</section>

		<section class="card shadow-sm shadow-slate-200/50 space-y-2">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
				<div class="space-y-1.5">
					<label for="firstName" class="input-label"
						>Имя <span class="text-danger-500">*</span></label
					>
					<input
						id="firstName"
						bind:value={formData.firstName}
						type="text"
						class="input {validation.firstNameInvalid
							? 'border-danger-500 focus:ring-danger-100'
							: ''}"
					/>
					<div class="h-5">
						{#if validation.firstNameInvalid}<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
							>
								Некорректное имя
							</p>{/if}
					</div>
				</div>
				<div class="space-y-1.5">
					<label for="lastName" class="input-label">Фамилия</label>
					<input
						id="lastName"
						bind:value={formData.lastName}
						type="text"
						class="input {validation.lastNameInvalid
							? 'border-danger-500 focus:ring-danger-100'
							: ''}"
					/>
					<div class="h-5">
						{#if validation.lastNameInvalid}<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
							>
								Некорректная фамилия
							</p>{/if}
					</div>
				</div>
				<div class="space-y-1.5 md:col-span-2">
					<label for="middleName" class="input-label">Отчество</label>
					<input
						id="middleName"
						bind:value={formData.middleName}
						type="text"
						class="input {validation.middleNameInvalid
							? 'border-danger-500 focus:ring-danger-100'
							: ''}"
					/>
					<div class="h-5">
						{#if validation.middleNameInvalid}<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
							>
								Некорректное отчество
							</p>{/if}
					</div>
				</div>
				<div class="space-y-1.5 md:col-span-2">
					<label for="email" class="input-label">Электронная почта</label>
					<div class="relative">
						<MailBoxOutline
							class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
						/>
						<input
							id="email"
							bind:value={formData.email}
							type="email"
							class="input pl-10 {validation.emailInvalid
								? 'border-danger-500 focus:ring-danger-100'
								: ''}"
						/>
					</div>
					<div class="h-5">
						{#if validation.emailInvalid}<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
							>
								Неверный формат почты
							</p>{/if}
					</div>
				</div>
			</div>
		</section>

		<section class="card shadow-sm shadow-slate-200/50">
			<div class="flex items-center gap-3 mb-6 text-slate-400">
				<LockOutline class="w-5 h-5" />
				<h3 class="text-sm font-bold uppercase tracking-widest text-slate-500">Безопасность</h3>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
				<div class="space-y-1.5">
					<label for="newPass" class="input-label">Новый пароль</label>
					<input
						id="newPass"
						bind:value={passwordData.newPassword}
						type="password"
						class="input"
						placeholder="••••••••"
					/>
					<div class="h-5"></div>
				</div>
				<div class="space-y-1.5">
					<label for="confirmPass" class="input-label">Подтверждение</label>
					<input
						id="confirmPass"
						bind:value={passwordData.confirmPassword}
						type="password"
						class="input {validation.passwordsMismatch
							? 'border-danger-500 focus:ring-danger-100'
							: ''}"
						placeholder="••••••••"
					/>
					<div class="h-5">
						{#if validation.passwordsMismatch}<p
								class="text-[10px] text-danger-500 font-bold uppercase tracking-wider"
							>
								Пароли не совпадают
							</p>{/if}
					</div>
				</div>
			</div>
		</section>

		{#if isDirty}
			<div
				transition:slide
				class="flex items-center justify-end gap-6 mt-4 pt-6 border-t border-slate-200/50"
			>
				<button
					onclick={handleCancel}
					class="text-xs font-bold text-slate-400 hover:text-danger-500 uppercase tracking-widest cursor-pointer"
				>
					Сбросить
				</button>
				<LoadingButton onclick={handleSave} loading={isSaving} disabled={!validation.isValid}>
					Сохранить изменения
				</LoadingButton>
			</div>
		{/if}
	</div>
</div>
