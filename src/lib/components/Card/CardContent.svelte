<script lang="ts">
    let { inlineStyles = "", children } = $props();
</script>

<div class="card-content" style={inlineStyles}>
    {@render children()}
</div>

<style>
    .card-content {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    @media (max-width: 480px) {
        .card-content {
            flex-direction: column;
            text-align: center;
        }
    }
</style>
