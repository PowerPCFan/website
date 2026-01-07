<script>
    let { children } = $props();
</script>

<div class="share-container">
    {@render children()}
</div>

<style>
    .share-container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>