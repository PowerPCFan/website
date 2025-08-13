<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Retro Tech Rewind Weekly Newsletter" />

<h1>Retro Tech Rewind Weekly Newsletter!</h1>
<h3>Warning: I rarely ever send out newsletters, it's more like a yearly newsletter lol</h3>
<p>You can sign up for the mailing list with this link: <a href="https://eepurl.com/iB66_Y" target="_blank">https&colon;//eepurl&period;com/iB66_Y</a>, which links to a Mailchimp form for sign-up.</p>
<p>The newsletter is mailed to your inbox once a week, and it includes the latest retro and modern tech news from various places across the internet.</p>
<p>Here's an example of what a newsletter might look like.</p>
<img src="/images/newsletter/examplenewsletter.png" alt="Example newsletter" />

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    h1 {
        font-size: 2.5rem;
    }

    h1, h3 {
        text-align: center;
    }

    p {
        text-align: center;
        font-size: 1.25rem;
    }

    img {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        display: block;
    }
</style>