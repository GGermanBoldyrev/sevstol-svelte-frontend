<script lang="ts">
	import { page } from '$app/stores';
	import { GridSolid, ChevronDownOutline, TagOutline, ArchiveOutline } from 'flowbite-svelte-icons';
	import BrandLogo from './NavbarLogo.svelte';
	import HeaderSearch from './NavbarSearch.svelte';
	import UserMenu from './NavbarUserMenu.svelte';
	import NavDropdown from './NavbarDropdown.svelte';

	interface Props {
		userName?: string;
	}
	let { userName }: Props = $props();

	let systemDropdown: ReturnType<typeof NavDropdown>;

	const isSystemActive = $derived(
		$page.url.pathname.startsWith('/system/admin') ||
			$page.url.pathname.startsWith('/system/honest')
	);
</script>

<header class="bg-surface/60 backdrop-blur-md px-4 py-4 sticky top-0 z-50">
	<nav
		class="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl
		       px-4 h-16 flex items-center justify-between shadow-sm shadow-slate-200/50 gap-4 transition-all"
	>
		<BrandLogo />

		<div class="flex-1 max-w-lg hidden md:block ml-4">
			<HeaderSearch />
		</div>

		<div class="flex items-center gap-3 md:gap-4">
			<NavDropdown bind:this={systemDropdown} align="right" width="w-56">
				{#snippet trigger()}
					<button
						class="flex items-center gap-2 px-3 lg:px-4 h-10 rounded-xl border font-medium
						       transition-all shadow-sm text-sm select-none cursor-pointer
						       {isSystemActive
							? 'bg-primary-500 text-white border-primary-600 shadow-primary-500/20'
							: 'bg-white text-slate-600 border-slate-200/80 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 shadow-slate-200/30'}"
					>
						<GridSolid class="w-4 h-4" />
						<span class="hidden lg:inline tracking-wide">Система</span>
						<ChevronDownOutline class="w-3.5 h-3.5 opacity-60" />
					</button>
				{/snippet}

				{#snippet children()}
					<!-- Администрирование -->
					<div class="px-4 pt-3 pb-1">
						<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
							Администрирование
						</p>
					</div>
					<div class="px-2 pb-1">
						<a
							href="/system/admin/positions"
							onclick={() => systemDropdown?.close()}
							class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline
							       {$page.url.pathname.startsWith('/system/admin/positions')
								? 'bg-primary-50 text-primary-600'
								: 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}"
						>
							<ArchiveOutline class="w-4 h-4 shrink-0 opacity-70" />
							Позиции компании
						</a>
					</div>

					<div class="mx-3 border-t border-slate-100"></div>

					<!-- Честный знак -->
					<div class="px-4 pt-3 pb-1">
						<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
							Честный знак
						</p>
					</div>
					<div class="px-2 pb-2">
						<a
							href="/system/honest/expiry"
							onclick={() => systemDropdown?.close()}
							class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline
							       {$page.url.pathname.startsWith('/system/honest/expiry')
								? 'bg-primary-50 text-primary-600'
								: 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}"
						>
							<TagOutline class="w-4 h-4 shrink-0 opacity-70" />
							Сроки годности
						</a>
					</div>
				{/snippet}
			</NavDropdown>

			<div class="w-px h-6 bg-slate-200 hidden md:block"></div>

			<UserMenu {userName} />
		</div>
	</nav>
</header>