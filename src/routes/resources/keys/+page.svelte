<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Product Keys" />

<h1>Product Keys</h1>
<hr />
<div id="links">
    <a href="/resources/keys/windows/xp/">Windows XP Keys</a>
    <br />
    <a href="/resources/keys/vmware/">VMware Keys</a>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    h1 {
        text-align: center;
        font-size: 40px;
    }

    hr {
        border-color: g.$border;
        width: 95vw;
    }

    #links {
        margin-top: 2rem;
        text-align: center;
        font-size: 25px;
        text-decoration: none;
    }
</style>