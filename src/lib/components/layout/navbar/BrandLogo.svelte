<script lang="ts">
	import { config } from '$lib/config';
</script>

<a href="/" class="flex items-center gap-3 no-underline shrink-0 group">
	<div
		class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/60 flex items-center justify-center text-primary-600 text-sm font-bold shadow-sm shadow-primary-500/10 group-hover:shadow-primary-500/20 transition-all duration-300"
	>
		{config.initials}
	</div>
	<span
		class="text-[15px] font-semibold tracking-tight text-slate-800 group-hover:text-primary-600 transition-colors hidden lg:block"
	>
		{config.name}
	</span>
</a>
