<script>
    let { title, siteTitle = "PowerPCFan's Website", separator = "|" } = $props();
</script>

<svelte:head>
    <title>{title} {separator} {siteTitle}</title>
</svelte:head>