<script lang="ts">
    let { children } = $props();

    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';
    injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<Header />

<main>
    {@render children()}
</main>

<Footer />

<style lang="scss">
    main {
        flex: 1;
        margin: 0;
        padding: 0;
        width: 100%;
    }
</style>
