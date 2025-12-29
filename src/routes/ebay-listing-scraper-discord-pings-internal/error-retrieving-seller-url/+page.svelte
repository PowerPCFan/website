<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    let ebaySellerName: string | null = null;

    onMount(() => {
        ebaySellerName = page?.url?.searchParams?.get('sellerName') || null;
    })
</script>

<h1>Uh-oh! An error occurred.</h1>

<p style="font-size: 1.1rem;">There was an error retrieving the seller URL.</p>

{#if ebaySellerName}
<p style="font-weight: bold; font-style: italic;">&#128161;Tip&colon; Try searching for &quot;{ebaySellerName}&quot; on eBay.</p>
{/if}
