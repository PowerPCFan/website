<script lang="ts">
    let { children } = $props();

    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
</script>

<Header />

<main>
    {@render children()}
</main>

<Footer />

<style lang="scss">
    main {
        margin: 0;
        padding: 0;
        width: 100%;
    }
</style>
