<script lang="ts">
	import { config } from '$lib/config';
</script>

<footer class="border-t border-slate-200 py-4 px-6">
	<p class="text-xs text-slate-400 text-center">
		© {new Date().getFullYear()}
		{config.name}
	</p>
</footer>
