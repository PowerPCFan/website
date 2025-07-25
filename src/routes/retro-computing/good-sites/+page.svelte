<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Good Sites for your Old Mac" />

<div class="container">
    <h1 class="title">Good Sites for your Old Macs</h1>
    <p class="text">Some awesome pages to get your old Mac up and running!</p>
    <div class="links">
        <a class="link" href="http://macintoshgarden.org">Macintosh Garden - A good resource for downloading old apps and games</a>
        <a class="link" href="http://macintoshrepository.org">Macintosh Repository - Another good resource for old apps and games</a>
        <a class="link" href="http://www.applefool.com/se30/">Apple Fool - Information about Macs and Mac Networking</a>
        <a class="link" href="http://obsolete.macfixer.com/vintage-software/">MacFixer - A useful site for downloading software for computers old as the Apple II!</a>
        <a class="link" href="http://frogfind.com/">FrogFind - A search engine created by YouTuber Action Retro, designed to run smoothly on basically any computer that has internet access.</a>
        <a class="link" href="http://www.ifixit.com">iFixIt - A huge site full of computer repair guides (may not load on an old mac.)</a>
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .container {
        margin: 0;
        padding: 1.5rem;
        height: 100%;
        width: auto;
        background-color: antiquewhite;
        color: g.$dark;
    }

    .title {
        margin: 0;
        text-align: center;
        font-size: 40px;
    }

    .text {
        font-weight: normal;
        text-align: center;
        font-size: 24px;
        margin-bottom: 2rem;
    }

    .links {
        text-align: center;
        .link {
            margin-bottom: 0.5rem;
            display: block;
            color: g.$link;
        }
    }
</style>