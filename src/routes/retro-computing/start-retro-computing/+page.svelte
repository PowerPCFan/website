<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Get Started with Retro Computing" />

<div class="container">
    <div class="container-2">
        
        <h1>How to get started with Retro Computing!</h1>
        <h2>This guide will help you find a good Apple Mac that will be reliable and fun to use as a vintage machine.</h2>
        <br />

        <div class="list">
            <ol>
                <li>
                    The iBook G4 is a great place for beginners to start, because they are:

                    <ul>
                        <li>Easy to find/buy</li>
                        <li>Cheap, usually under $75</li>
                        <li>Fast!</li>
                        <li>Still usable &lpar;with browsers like <a href="https://macintoshgarden.org/apps/interwebppc-browser-a-rebrand-of-tenfourfox-the-future">InterWebPPC</a> you can send emails, watch YouTube, and more!&rpar;</li>
                        <li>Great &quot;coffee shop&quot; computers, because they are old, usable, and not as valuable as your new iPad Pro, gaming laptop, or MacBook Pro.</li>
                    </ul>
                </li>

                <li>Another great option if you want 80s vintage Macs is a 68k SE/30. It's nostalgic, has a cool 2-color grayscale display, and you can mod it to your liking :)</li>

                <li>The third great option is a Power Mac G5 because it's super fast (great for light <i>and heavy</i> tasks!!), not too expensive, and easy to use and set up, as long as you have a decent monitor (i use an old lcd tv with a vga port) and a usb keyboard & mouse.</li>

                <li>Last but not least, the eMac (education macintosh) or iMac G3 are both lower-end PowerPC macs. The iMac G3 is still very capable, and it makes a great OS 9 mac. The eMac is a great Mac for light browsing on vintage macs, and maybe playing some retro games like Doom.</li>
            </ol>
        </div>
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .container {
        height: 100%;
        width: auto;
        padding: 2rem;
        background-image: url("/images/background-tiles/1.png");
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

    h1 {
        text-align: center;
        font-size: 45px;
    }

    h2 {
        text-align: center;
        font-size: 22px;
    }

    .list {
        text-align: left;
        font-size: 22px;
    }
</style>
