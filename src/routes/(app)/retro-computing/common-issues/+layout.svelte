<script lang="ts">
    let { children } = $props();
</script>

<div class="container">
    <div class="container-2">
        {@render children()}
    </div>
</div>  

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .container {
        height: 100%;
        width: auto;
        padding: 2rem;
        background-image: url("/images/background-tiles/2.png");
        background-repeat: repeat;

        .container-2 {
            margin-inline: auto;
            width: 90%;
            background-color: g.$light;
            color: g.$dark;
            padding: 0.5rem 2rem 0.5rem 2rem;
            border-radius: 1rem;
        }
    }
</style>