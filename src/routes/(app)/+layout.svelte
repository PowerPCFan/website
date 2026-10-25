<script lang="ts">
    import "../../app.css";
    import Header from "$lib/components/header.svelte";
    import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';

    let { children } = $props();

    injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<Header />

<main class="flex-1 m-0 p-0 w-full">
    {@render children()}
</main>
