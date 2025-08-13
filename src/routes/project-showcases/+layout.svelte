<script lang="ts">
    let { children } = $props();
</script>

<div id="page-container">
    {@render children()}
</div>

<style>
    #page-container {
        /* width: 100%; */
        padding: 0.75rem 2rem;
        margin: 0;
    }
</style>