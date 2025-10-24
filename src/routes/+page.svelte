<script lang="ts">
    import Title from "$lib/components/title.svelte";
    import Site88x31s from "$lib/components/site88x31s.svelte";
    import NowPlaying from "$lib/components/Widgets/NowPlaying.svelte";
    import TimeWidget from "$lib/components/Widgets/TimeWidget.svelte";
    import Countdown from "$lib/components/Widgets/Countdown.svelte";
    import Pet from "$lib/components/Widgets/Pet.svelte";
    import BrowserStats from "$lib/components/Widgets/BrowserStats.svelte";
    import VSCodeStatus from "$lib/components/Widgets/VSCodeStatus.svelte";

    let xp: boolean = $state(true);
</script>

<Title title="Home" />

<noscript>
    <center>
        <h1 style="margin-inline: 1rem;">
            Warning: Your browser does not support JavaScript.
            Some pages on this website require JavaScript to function properly.
        </h1>
    </center>
</noscript>

<div id="page-container" class="{xp ? 'xp' : ''}">
    <h1 id="page-title">Welcome to PowerPCFan's Website</h1>
    <div class="container-thing{xp ? ' xp' : ''}">
        <h2>about me</h2>
        <hr />
        <div class="about-me">
            <p>
                Hi, I’m Charlie! I love computers - whether it's building and selling PCs, messing around with hardware, or coding &lpar;usually Python, Svelte, TypeScript, and PowerShell&rpar;.
                I’m also into gaming and my favorite game is probably BeamNG.drive.
                I love retro tech as well - especially Apple's PowerPC Macs of the 90s-2000s.
                Music-wise, I like new wave/synthpop, alt/indie/punk rock, nu-metal, and sometimes modern country and pop.
                Check out some of my widgets below.
            </p>
        </div>

        <div class="widget-grid">
            <div class="widget">
                <h2>last.fm</h2>
                <!-- <hr /> -->
                <NowPlaying username="PowerPCFan" />
            </div>

            <div class="widget">
                <h2>vscode status</h2>
                <VSCodeStatus userId="3818207096435605" />
            </div>

            <div class="widget">
                <h2>time</h2>
                <!-- <hr /> -->
                <TimeWidget />
            </div>

            <div class="widget">
                <h2>countdowns</h2>
                <!-- <hr /> -->
                <Countdown />
            </div>

            <div class="widget">
                <h2>buddy the gifypet</h2>
                <!-- <hr /> -->
                <Pet />
            </div>

            <div class="widget">
                <h2>browser stats</h2>
                <!-- <hr /> -->
                <BrowserStats />
            </div>
        </div>

        <h2>links</h2>
        <hr />
        <div class="links">
            <a class="link" href="https://github.com/PowerPCFan/" target="_blank">
                <i class="font-awesome-icon fa-brands fa-github"></i>
                <span class="ul">GitHub</span>
            </a>
            <a class="link" href="https://youtube.com/@charliesretrocomputing/" target="_blank">
                <i class="font-awesome-icon fa-brands fa-square-youtube"></i>
                <span class="ul">YouTube</span>
            </a>
            <a class="link" href="https://open.spotify.com/user/31nmpykqw3mfa7luhps4bchppusy" target="_blank">
                <i class="font-awesome-icon fa-brands fa-spotify"></i>
                <span class="ul">Spotify</span>
            </a>
            <a class="link" href="https://steamcommunity.com/profiles/76561199516243582" target="_blank">
                <i class="font-awesome-icon fa-brands fa-steam"></i>
                <span class="ul">Steam</span>
            </a>
            <a class="link" href="mailto:charlies.retro.computing@gmail.com" target="_blank">
                <i class="fa-solid fa-envelope"></i>
                <span class="ul">Email</span>
            </a>
        </div>

        <h2>88&times;31s</h2>
        <hr />
        <Site88x31s />

        <div id="toggle-button-wrapper">
            <button onclick={(() => {xp = !xp})}>you found the secret button! click me to toggle page theme</button>
        </div>
    </div>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    #page-container {
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.xp {
            background-image: url('/images/bliss.jpg');
            background-size: cover;
        }

        #page-title {
            font-size: 3rem;
            text-align: center;
            align-self: center;
        }

        .container-thing {
            border: 1px g.$border solid;
            border-radius: 0.5rem;
            padding: 0.5rem 2.5rem 1rem 2.5rem;
            // box-shadow: 0 0 0.8rem rgba(g.$border, 0.2);


            // lowest value that max width can be
            $min: 275px;
            // highest value that max width can be
            // DO NOT CHANGE THIS IT MESSES UP WIDGETS
            $max: 900px;
            // highest value that max width can be on small screens
            $small-screen-max: 98vw;

            // dont touch this
            max-width: clamp($min, min($small-screen-max, $max), $max);


            &.xp {
                background-color: rgba(g.$dark, 0.8);
                border-radius: 2rem;
            }

            p {
                text-wrap: normal;
                line-height: 1.5;
            }

            h2 {
                margin: 1.2rem 0 0.5rem 0;
            }

            .links {
                > a:first-child {
                    margin-top: 1rem;
                }

                .link {
                    font-size: 1.2rem;
                    color: g.$light;
                    text-decoration: none;

                    margin-top: 0.35rem;

                    display: flex;
                    align-items: center;
                    flex-direction: row;

                    width: fit-content;

                    .font-awesome-icon, .fa-solid {
                        font-size: 2.2rem;
                        margin-right: 0.5rem;
                    }
                }
            }
        }
    }

    #toggle-button-wrapper {
        text-align: center;
        width: 100%;
        margin-inline: auto;
        margin-block: 1.5rem 0;

        button {
            font-family: g.$stack;
            font-size: 0.8rem;
        }
    }

    .widget-grid {
        display: grid;
        gap: 16px;
        align-items: stretch;
        grid-template-columns: repeat(
            auto-fit,
            minmax(clamp(200px, 100%, 400px), 1fr)
        );
    }

    .widget {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
    }
</style>