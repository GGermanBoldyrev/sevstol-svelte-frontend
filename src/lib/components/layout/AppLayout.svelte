<script lang="ts">
	import AppNavbar from './navbar/AppNavbar.svelte';
	import AppAlert from '$lib/components/ui/AppAlert.svelte';

	interface Props {
		children: import('svelte').Snippet;
		userName?: string;
	}

	let { children, userName }: Props = $props();
</script>

<div class="min-h-screen bg-surface flex flex-col">
	<AppNavbar {userName} />

	<main class="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
		<AppAlert />
		{@render children()}
	</main>

	<footer class="border-t border-slate-200 py-4 px-6">
		<p class="text-xs text-slate-400 text-center">
			© {new Date().getFullYear()} Северная столица
		</p>
	</footer>
</div>