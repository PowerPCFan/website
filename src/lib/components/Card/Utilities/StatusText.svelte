<script lang="ts">
    let { children } = $props();
</script>


<h3 class="status-text">{@render children()}</h3>


<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .status-text {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: g.$border;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
</style>