<script lang="ts">
    let { loading = false, error = false, green = false, yellow = false } = $props();

    const classes = `status-indicator${loading ? ' loading' : ''}${error ? ' error' : ''}${green ? ' green' : ''}${yellow ? ' yellow' : ''}`;
</script>


<div class={classes} aria-hidden="true"></div>


<style lang="scss">
    @use '/static/scss/global.scss' as g;

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.6;
            transform: scale(1.2);
        }
    }

    .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: g.$border;
        transition: all 0.3s ease;

        &.loading {
            background: g.$border;
            animation: pulse 1s linear infinite;
        }

        &.error {
            background: g.$red;
        }

        &.green {
            background: g.$green;
        }

        &.yellow {
            background: g.$yellow;
        }
    }
</style>