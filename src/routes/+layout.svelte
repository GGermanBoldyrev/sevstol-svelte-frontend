<script lang="ts">
    import AppNavbar from '$lib/components/layout/navbar/AppNavbar.svelte';
    import AppFooter from '$lib/components/layout/AppFooter.svelte';
    import '$lib/styles/app.css';

    interface Props {
        children: import('svelte').Snippet;
        userName?: string;
    }

    let { children, userName }: Props = $props();
</script>

<div class="min-h-screen bg-surface flex flex-col">
    <AppNavbar {userName} />

    <main class="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {@render children()}
    </main>

    <AppFooter />
</div>