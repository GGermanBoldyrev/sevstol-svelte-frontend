<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
</script>

<div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
	<div class="text-9xl font-light text-primary-200/50 mb-4 select-none tracking-tighter">
		{$page.status}
	</div>

	<h1 class="text-2xl font-semibold text-primary-600 mb-3">
		{#if $page.status === 404}
			Страница не найдена
		{:else if $page.status === 403}
			Доступ запрещён
		{:else}
			Что-то пошло не так
		{/if}
	</h1>

	<p class="text-base text-slate-500 max-w-sm mb-10 leading-relaxed">
		{#if $page.status === 404}
			Возможно, страница была удалена, перемещена или вы перешли по неверной ссылке.
		{:else}
			Попробуйте обновить страницу или вернитесь на главную.
		{/if}
	</p>

	<Button
		href="/"
		color="none"
		class="bg-primary-500 text-white hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-all gap-2 px-6 py-2.5 rounded-xl shadow-lg shadow-primary-500/20"
	>
		<ArrowLeftOutline class="w-4 h-4" />
		На главную страницу
	</Button>
</div>
