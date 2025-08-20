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
        box-shadow: 0.3rem 0.3rem 0.75rem 0 rgba(0, 0, 0, 0.3);
        max-width: 400px;

        transition: box-shadow 0.2s ease-in-out;

        &.error {
            border-color: g.$red;
        }

        &:hover {
            box-shadow: 0.5rem 0.5rem 0.9rem 0 rgba(0, 0, 0, 0.3);
        }
    }

    @media (max-width: 480px) {
        .card {
            padding: 1rem;
            max-width: 100%;
        }
    }
</style>
