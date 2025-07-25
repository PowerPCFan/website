<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Common Problems with Old Macs" />
    
<h1>Common Problems with Old Apple Macs</h1>

<div id="links">
    <a href="/retro-computing/common-issues/vinegar-syndrome">Vinegar Syndrome</a>
    <a href="/retro-computing/common-issues/exploding-batteries">Exploding Batteries</a>
    <a href="/retro-computing/common-issues/crt-problems">CRT Problems</a>
    <a href="/retro-computing/common-issues/rifa-caps">Exploding RIFA Filter Caps</a>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    h1 {
        text-align: center;
        font-size: 3rem;
    }

    #links {
        margin-bottom: 2rem;
        a {
            margin-top: 0.25rem;
            text-align: center;
            font-size: 25px;
            display: block;
            color: g.$link;
            transition: color 0.15s ease;
        
            &:hover {
                color: darken(g.$link, 25);
                cursor: pointer;
            }
        }
    }
</style>