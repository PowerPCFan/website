<script lang="ts">
    import Title from "$lib/components/title.svelte";

    let query: string = $state("");
    let url: string = $state("");

    function search() {
        url = `https://1337x.to/search/${encodeURIComponent(query)}/1/`;
        window.open(url);
    }

    function handlekeypress(event: KeyboardEvent) {
        let key = event.key.toLowerCase();
        if (key === "enter") {
            search();
        }
    }
</script>

<Title title="1337x.to Search" />

<div id="container">
    <h1>1337x.to Search</h1>
    <label for="name">Search:</label>
    <input onkeypress={handlekeypress} type="text" id="query" bind:value={query} aria-label="Search query" placeholder="Enter search query" />
    <br />
    <br />
    <button onclick={search}>Search</button>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    #container {
        margin: 1.5rem;
    }

    h1 {
        text-align: left;
    }

    label {
        display: block;
    }

    input[type="text"] {
        padding: 10px;
        border: 1px solid g.$border;
        border-radius: 5px;
        width: 666px;
        box-sizing: border-box;
        background-color: #000000;
        color: g.$light;
        font-family: g.$stack;
    }

    button {
        background-color: g.$dark;
        border: 0;
        color: g.$light;
        border-radius: 0.5em;
        font-size: 1.35rem;
        font-family: g.$stack;
        padding: 0.375em 1em;
        font-weight: 600;
        transition: 0.2s ease;
        box-shadow: 0 0 0.6em rgba(235, 235, 235, 1);
        cursor: pointer;
    
        &:hover {
            translate: 0 0.125em;
            box-shadow: 0 0 0.3em rgba(141, 141, 141, 1);
            color: darken(g.$light, 10%);
        }
    }
</style>