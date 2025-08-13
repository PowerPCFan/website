<script lang="ts">
    let { children } = $props();
</script>

<div id="page-container">
    {@render children()}
</div>

<style>
    #page-container {
        width: 100%;
        margin: 0;
        padding: 1rem;
    }
</style>