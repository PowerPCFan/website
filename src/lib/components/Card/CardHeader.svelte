<script lang="ts">
    let { children } = $props();
</script>

<div class="card-header">
    {@render children()}
</div>

<style>
    .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }
</style>
