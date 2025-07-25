<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Common Problems with Old Macs" />
    
<div class="container">
    <div class="container-2">
        <h1>Common Problems with Old Apple Macs</h1>

        <div id="links">
            <a href="/retro-computing/common-issues/vinegar-syndrome">Vinegar Syndrome</a>
            <br /><br />
            <a href="/retro-computing/common-issues/exploding-batteries">Exploding Batteries</a>
            <br /><br />
            <a href="/retro-computing/common-issues/crt-problems">CRT Problems</a>
            <br /><br />
            <a href="/retro-computing/common-issues/rifa-caps">Exploding RIFA Filter Caps</a>
            <br /><br />
        </div>
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
            padding: 1rem;
            border-radius: 1rem;
        }
    }

    a {
        color: g.$link;
        transition: color 0.15s ease;
    
        &:hover {
            color: darken(g.$link, 25);
            cursor: pointer;
        }
    }

    h1 {
        text-align: center;
        font-size: 60px;
    }

    a,
    #links {
        text-align: center;
        font-size: 25px;
    }
</style>