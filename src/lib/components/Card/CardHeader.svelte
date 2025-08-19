<script lang="ts">
    let { inlineStyles = "", children } = $props();
</script>

<div class="card-header" style={inlineStyles}>
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
