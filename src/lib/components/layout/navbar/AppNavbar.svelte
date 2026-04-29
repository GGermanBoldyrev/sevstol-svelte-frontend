<script lang="ts">
	import { GridSolid } from 'flowbite-svelte-icons';

	// Импорты наших новых компонентов
	import BrandLogo from './BrandLogo.svelte';
	import HeaderSearch from './NavbarSearch.svelte';
	import UserMenu from './UserMenu.svelte';

	interface Props {
		userName?: string;
	}
	let { userName }: Props = $props();
</script>

<header class="bg-surface/60 backdrop-blur-md px-4 py-4 sticky top-0 z-50">
	<nav
		class="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl px-4 h-16 flex items-center justify-between shadow-sm shadow-slate-200/50 gap-4 transition-all"
	>
		<!-- 1. Логотип -->
		<BrandLogo />

		<!-- 2. Поиск -->
		<div class="flex-1 max-w-lg hidden md:block ml-4">
			<HeaderSearch />
		</div>

		<!-- 3. Правая панель кнопок -->
		<div class="flex items-center gap-3 md:gap-4">
			<!-- Кнопка администрирования (пока оставил тут, так как она простая) -->
			<button
				class="flex items-center justify-center gap-2 px-3 lg:px-4 h-10 bg-white text-slate-600 rounded-xl border border-slate-200/80 font-medium hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all shadow-sm shadow-slate-200/30 cursor-pointer"
			>
				<GridSolid class="w-4 h-4" />
				<span class="text-sm hidden lg:inline tracking-wide">Администрирование</span>
			</button>

			<div class="w-px h-6 bg-slate-200 hidden md:block"></div>
			<!-- Разделитель -->

			<!-- Пользовательское меню -->
			<UserMenu {userName} />
		</div>
	</nav>
</header>
