<script lang="ts">
    import Holder from "$lib/components/Holder.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Product Keys" />

<Holder>
    <h1>Product Keys</h1>
    <hr />
    <div id="links">
        <a href="/resources/keys/windows/xp/">Windows XP Keys</a>
        <br />
        <a href="/resources/keys/vmware/">VMware Keys</a>
    </div>
</Holder>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    h1 {
        text-align: center;
        font-size: 40px;
    }

    #links {
        margin-top: 1rem;
        text-align: center;
        font-size: 25px;
        text-decoration: none;
    }
</style>