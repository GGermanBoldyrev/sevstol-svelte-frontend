<script lang="ts">
	import { fade } from 'svelte/transition';
	import { CheckOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { alert } from '$lib/state/alert.svelte';
</script>

{#if alert.current.show}
	<div
		transition:fade
		class="fixed top-24 right-8 z-[100] px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 text-white
		{alert.current.type === 'success' ? 'bg-success-600' : 'bg-danger-600'}"
	>
		{#if alert.current.type === 'success'}
			<CheckOutline class="w-5 h-5" />
		{:else}
			<ExclamationCircleOutline class="w-5 h-5" />
		{/if}
		<span class="font-medium">{alert.current.text}</span>
	</div>
{/if}
