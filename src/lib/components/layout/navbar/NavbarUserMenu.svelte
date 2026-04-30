<script lang="ts">
	import { ArrowRightToBracketOutline, UserSettingsOutline } from 'flowbite-svelte-icons';
	import NavDropdown from './NavbarDropdown.svelte';

	interface Props {
		userName?: string;
	}
	let { userName = 'Герман' }: Props = $props();

	const userInitials = $derived(
		userName
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w: string) => w[0].toUpperCase())
			.join('')
	);

	let dropdown: ReturnType<typeof NavDropdown>;
</script>

<NavDropdown bind:this={dropdown} align="right" width="w-64">
	{#snippet trigger()}
		<button class="outline-none border-none p-0 bg-transparent shrink-0 group cursor-pointer">
			<div
				class="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200/60 flex items-center
				       justify-center text-primary-700 text-sm font-bold shadow-sm shadow-primary-500/10
				       group-hover:shadow-primary-500/20 transition-all duration-300"
			>
				{userInitials}
			</div>
		</button>
	{/snippet}

	{#snippet children()}
		<!-- Шапка с именем -->
		<div class="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
			<p class="text-sm font-semibold text-slate-800 leading-tight">{userName}</p>
			<p class="text-[10px] text-primary-500 uppercase font-bold tracking-widest mt-1">
				Администратор
			</p>
		</div>

		<!-- Пункты меню -->
		<div class="p-2 space-y-0.5">
			<a
				href="/settings/profile"
				onclick={() => dropdown?.close()}
				class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600
				       hover:bg-primary-50 hover:text-primary-600 transition-colors no-underline font-medium"
			>
				<UserSettingsOutline class="w-[18px] h-[18px] shrink-0" />
				Настройки профиля
			</a>

			<div class="border-t border-slate-100 my-1"></div>

			<button
				onclick={() => dropdown?.close()}
				class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger-500
				       hover:bg-danger-50 hover:text-danger-600 transition-colors font-medium cursor-pointer
				       border-none bg-transparent text-left"
			>
				<ArrowRightToBracketOutline class="w-[18px] h-[18px] shrink-0" />
				Выйти из системы
			</button>
		</div>
	{/snippet}
</NavDropdown>