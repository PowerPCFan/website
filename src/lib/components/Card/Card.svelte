<script lang="ts">
    let { error = false, inlineStyles = "", children } = $props();
</script>


<div class="card {error ? 'error' : ''}" style="{inlineStyles}">
    {@render children()}
</div>


<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .card {
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 0.5rem 0.75rem rgba(0, 0, 0, 0.4);
        max-width: 400px;

        &.error {
            border-color: g.$red;
        }
    }

    @media (max-width: 480px) {
        .card {
            padding: 1rem;
            max-width: 100%;
        }
    }
</style>
