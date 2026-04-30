<script lang="ts">
	import { slide } from 'svelte/transition';
	import { UserOutline, MailBoxOutline, LockOutline } from 'flowbite-svelte-icons';
	import { alert } from '$lib/state/alert.svelte';
	import LoadingButton from '$lib/components/ui/LoadingButton.svelte';

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

<div class="max-w-7xl mx-auto py-10 px-4 text-slate-900">
	<!-- Заголовок — точно как на positions и honest-sign -->
	<header class="flex items-start justify-between gap-4 mb-10 h-16">
		<div>
			<h1 class="text-3xl font-light text-primary-500 tracking-tight">Настройки профиля</h1>
			<p class="text-slate-500 mt-1">Управляйте личными данными и безопасностью</p>
		</div>
	</header>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Левая колонка: аватар -->
		<div class="lg:col-span-1">
			<div class="card shadow-sm shadow-slate-200/50 flex items-center gap-5">
				<div class="relative shrink-0">
					<div
						class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/60 flex items-center justify-center text-primary-600 text-2xl font-bold"
					>
						{userInitials}
					</div>
					<div
						class="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm text-slate-400"
					>
						<UserOutline class="w-3 h-3" />
					</div>
				</div>
				<div>
					<p class="text-sm font-semibold text-slate-800">
						{formData.firstName}
						{formData.lastName}
					</p>
					<p class="text-xs text-primary-500 uppercase font-bold tracking-widest mt-1">
						Администратор
					</p>
				</div>
			</div>
		</div>

		<!-- Правая колонка: формы -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Личные данные -->
			<section class="card shadow-sm shadow-slate-200/50">
				<div class="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
					<UserOutline class="w-4 h-4 text-slate-400" />
					<h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">Личные данные</h3>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
					<div class="space-y-1.5">
						<label for="firstName" class="input-label">
							Имя <span class="text-danger-500">*</span>
						</label>
						<input
							id="firstName"
							bind:value={formData.firstName}
							type="text"
							class="input {validation.firstNameInvalid
								? 'border-danger-500 focus:ring-danger-100'
								: ''}"
						/>
						<div class="h-5">
							{#if validation.firstNameInvalid}
								<p class="text-[10px] text-danger-500 font-bold uppercase tracking-wider">
									Некорректное имя
								</p>
							{/if}
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
							{#if validation.lastNameInvalid}
								<p class="text-[10px] text-danger-500 font-bold uppercase tracking-wider">
									Некорректная фамилия
								</p>
							{/if}
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
							{#if validation.middleNameInvalid}
								<p class="text-[10px] text-danger-500 font-bold uppercase tracking-wider">
									Некорректное отчество
								</p>
							{/if}
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
							{#if validation.emailInvalid}
								<p class="text-[10px] text-danger-500 font-bold uppercase tracking-wider">
									Неверный формат почты
								</p>
							{/if}
						</div>
					</div>
				</div>
			</section>

			<!-- Безопасность -->
			<section class="card shadow-sm shadow-slate-200/50">
				<div class="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
					<LockOutline class="w-4 h-4 text-slate-400" />
					<h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">Безопасность</h3>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
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
							{#if validation.passwordsMismatch}
								<p class="text-[10px] text-danger-500 font-bold uppercase tracking-wider">
									Пароли не совпадают
								</p>
							{/if}
						</div>
					</div>
				</div>
			</section>

			<!-- Кнопки -->
			{#if isDirty}
				<div
					transition:slide
					class="flex items-center justify-end gap-6 pt-5 border-t border-slate-200/50"
				>
					<button
						onclick={handleCancel}
						class="text-xs font-bold text-slate-400 hover:text-danger-500 uppercase tracking-widest cursor-pointer transition-colors"
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
</div>
