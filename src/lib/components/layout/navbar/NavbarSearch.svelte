<script lang="ts">
	import { SearchOutline } from 'flowbite-svelte-icons';
</script>

<div class="relative group w-full">
	<SearchOutline
		class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 group-focus-within:text-primary-500 transition-colors"
	/>
	<input
		type="search"
		placeholder="Поиск по задачам..."
		class="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all outline-none appearance-none shadow-sm shadow-slate-100/50"
	/>
</div>
