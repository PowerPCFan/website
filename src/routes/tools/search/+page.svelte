<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Custom Search Engines" />

<h1>Custom Search Engines</h1>
<hr />
<div id="links">
    <a href="/tools/search/1337x/">1337x.to Search</a>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    h1 {
        text-align: center;
        font-size: 40px;
    }

    #links {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 25px;
        
        a {
            color: g.$link;
            text-decoration: underline;
        }
    }
</style>