<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	interface Props {
		children: any;
		loading?: boolean;
		disabled?: boolean;
		onclick?: () => void;
		class?: string;
	}
	let { children, loading = false, disabled = false, onclick, class: className }: Props = $props();
</script>

<button 
	{onclick} 
	disabled={disabled || loading}
	class="btn-primary relative !h-11 px-10 rounded-xl shadow-lg shadow-primary-500/20 transition-all overflow-hidden disabled:opacity-50 {className}"
>
	<div class="grid place-items-center">
		<div class="col-start-1 row-start-1 flex items-center gap-2 {loading ? 'opacity-0' : 'opacity-100'} transition-opacity">
			{@render children()}
		</div>
		
		{#if loading}
			<div class="col-start-1 row-start-1 flex items-center justify-center">
				<Spinner size="4" color="white" />
			</div>
		{/if}
	</div>
</button>