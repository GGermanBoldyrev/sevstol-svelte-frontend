<script lang="ts">
	import { page } from '$app/stores';
	import { GridSolid, ChevronDownOutline, TagOutline, ArchiveOutline } from 'flowbite-svelte-icons';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import BrandLogo from './NavbarLogo.svelte';
	import HeaderSearch from './NavbarSearch.svelte';
	import UserMenu from './NavbarUserMenu.svelte';

	interface Props {
		userName?: string;
	}
	let { userName }: Props = $props();

	// Активен ли какой-либо раздел системы
	const isSystemActive = $derived(
		$page.url.pathname.startsWith('/system/admin') ||
			$page.url.pathname.startsWith('/system/honest')
	);
</script>

<header class="bg-surface/60 backdrop-blur-md px-4 py-4 sticky top-0 z-50">
	<nav
		class="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl px-4 h-16 flex items-center justify-between shadow-sm shadow-slate-200/50 gap-4 transition-all"
	>
		<BrandLogo />

		<div class="flex-1 max-w-lg hidden md:block ml-4">
			<HeaderSearch />
		</div>

		<div class="flex items-center gap-3 md:gap-4">
			<!-- Главное меню разделов -->
			<div class="relative">
				<button
					id="nav-system-menu"
					class="flex items-center justify-center gap-2 px-3 lg:px-4 h-10 rounded-xl border font-medium transition-all shadow-sm no-underline text-sm
					{isSystemActive
						? 'bg-primary-500 text-white border-primary-600 shadow-primary-500/20'
						: 'bg-white text-slate-600 border-slate-200/80 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 shadow-slate-200/30'}"
				>
					<GridSolid class="w-4 h-4" />
					<span class="hidden lg:inline tracking-wide">Система</span>
					<ChevronDownOutline class="w-3.5 h-3.5 opacity-60" />
				</button>

				<Dropdown
					triggeredBy="#nav-system-menu"
					class="w-64 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2 list-none bg-white z-50 mt-1"
				>
					<!-- Администрирование -->
					<div class="px-3 py-2 mb-1">
						<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
							Администрирование
						</p>
					</div>
					<DropdownItem
						href="/system/admin/positions"
						class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors border-none before:hidden font-medium
						{$page.url.pathname.startsWith('/system/admin/positions')
							? 'bg-primary-50 text-primary-600'
							: 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}"
					>
						<ArchiveOutline class="w-4 h-4 shrink-0" />
						Позиции компании
					</DropdownItem>

					<!-- Разделитель -->
					<div class="border-t border-slate-100 my-2"></div>

					<!-- Честный знак -->
					<div class="px-3 py-2 mb-1">
						<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
							Честный знак
						</p>
					</div>
					<DropdownItem
						href="/system/honest/expiry"
						class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors border-none before:hidden font-medium
						{$page.url.pathname.startsWith('/system/honest/expiry')
							? 'bg-primary-50 text-primary-600'
							: 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}"
					>
						<TagOutline class="w-4 h-4 shrink-0" />
						Сроки годности
					</DropdownItem>
				</Dropdown>
			</div>

			<div class="w-px h-6 bg-slate-200 hidden md:block"></div>

			<UserMenu {userName} />
		</div>
	</nav>
</header>
