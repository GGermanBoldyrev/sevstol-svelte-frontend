<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	const errorData = $derived({
		status: $page.status,
		title:
			$page.status === 404
				? 'Страница не найдена'
				: $page.status === 403
					? 'Доступ ограничен'
					: 'Ошибка сервера',
		description:
			$page.status === 404
				? 'Возможно, страница была удалена или вы перешли по неверной ссылке.'
				: $page.status === 403
					? 'У вас недостаточно прав для просмотра этого раздела.'
					: 'Мы уже работаем над исправлением проблемы. Попробуйте позже.'
	});
</script>

<div
	class="max-w-7xl mx-auto min-h-[75vh] flex flex-col items-center justify-center py-10 px-4 text-center"
>
	<div class="relative mb-8">
		<div
			class="text-[12rem] sm:text-[15rem] font-light text-primary-500/10 select-none tracking-tighter leading-none"
		>
			{errorData.status}
		</div>

		<div class="absolute inset-0 flex flex-col items-center justify-center pt-10">
			<h1 class="text-3xl font-light text-primary-500 tracking-tight">{errorData.title}</h1>
			<p class="text-slate-500 mt-4 max-w-sm leading-relaxed">
				{errorData.description}
			</p>
		</div>
	</div>

	<a
		href="/"
		class="btn-primary flex items-center gap-2 !h-12 px-8 shadow-lg shadow-primary-500/20 transition-transform active:scale-95"
	>
		<ArrowLeftOutline class="w-5 h-5" />
		На главную страницу
	</a>
</div>

<style>
	:global(body) {
		background-color: #ffffff;
	}
</style>
