<script>
    let { children } = $props();
</script>

<div class="container">
    {@render children()}
</div>

<style>
    .container {
        padding-inline: 1.5rem;
        padding-block: 0.25rem;
        margin: 0;
    }
</style>
