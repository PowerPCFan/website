<script lang="ts">
    import "../../app.css";
    // import "../../../static/material-symbols/style.css";
    import Header from "$lib/components/header.svelte";
    import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    let { children } = $props();

    injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<Header />

<main class="flex-1 m-0 p-0 w-full">
    <!-- Register tooltip provider to enable tooltips throughout the site -->
    <Tooltip.Provider>
        {@render children()}
    </Tooltip.Provider>
</main>

<style>
    @import "/static/material-symbols/style.css";
</style>