<script lang="ts">
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ArrowRightToBracketOutline, UserSettingsOutline } from 'flowbite-svelte-icons';

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
</script>

<!-- Кнопка профиля (стилизована точно как левый логотип) -->
<button
	id="user-menu"
	class="outline-none border-none p-0 bg-transparent shrink-0 group cursor-pointer"
>
	<div
		class="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200/60 flex items-center justify-center text-primary-700 text-sm font-bold shadow-sm shadow-primary-500/10 group-hover:shadow-primary-500/20 transition-all duration-300"
	>
		{userInitials}
	</div>
</button>

<!-- Выпадающее меню -->
<Dropdown
	triggeredBy="#user-menu"
	class="w-64 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2 list-none bg-white z-50"
>
	<div class="px-3 py-3 mb-1 border-b border-slate-100/80 bg-slate-50/50 rounded-t-xl -mt-1 -mx-1">
		<p class="text-sm font-semibold text-slate-800 leading-tight tracking-tight">{userName}</p>
		<p class="text-[11px] text-primary-500 uppercase font-bold tracking-widest mt-1.5">
			Администратор
		</p>
	</div>

	<div class="space-y-0.5 mt-2">
		<DropdownItem
			href="/settings"
			class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors border-none before:hidden font-medium"
		>
			<UserSettingsOutline class="w-[18px] h-[18px]" />
			Настройки профиля
		</DropdownItem>

		<div class="border-t border-slate-100/80 my-1"></div>

		<DropdownItem
			class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger-500 hover:bg-danger-50 hover:text-danger-600 transition-colors border-none before:hidden font-medium"
		>
			<ArrowRightToBracketOutline class="w-[18px] h-[18px]" />
			Выйти из системы
		</DropdownItem>
	</div>
</Dropdown>
