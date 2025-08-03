<script lang="ts">
    import Title from "$lib/components/title.svelte";
    import Site88x31s from "$lib/components/site88x31s.svelte";
    import NowPlaying from "$lib/components/nowPlaying.svelte";
</script>

<Title title="Home" />

<div id="page-container">
    <h1 id="page-title">Welcome to PowerPCFan's Website</h1>
    <div class="container-thing">
        <h2>About Me</h2>
        <hr />
        <div class="about-me">
            <p>
                Hi, I’m Charlie! I love computers - whether it's building and selling PCs, messing around with hardware, or coding. My favorite languages are Python, Svelte, TypeScript, and PowerShell. 
                I’m also into gaming and my favorite game is probably BeamNG.drive. 
                I love retro tech as well - especially Apple's PowerPC Macs of the 90s-2000s. 
                Music-wise, I like new wave/synthpop, alt/indie/punk rock, nu metal, and sometimes modern country/pop. 
                Check out the last.fm widget below!
            </p>
        </div>

        <h2>last.fm</h2>
        <hr />
        <NowPlaying username="PowerPCFan" />

        <h2>Links</h2>
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
    </div>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    .ul {
        text-decoration: underline;
    }

    #page-container {
        margin: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        #page-title {
            font-size: 3rem;
            text-align: center;
            align-self: center;
        }

        .container-thing {
            border: 2px g.$border solid;
            border-radius: 0.5rem;
            padding: 0.5rem 2.5rem 1rem 2.5rem;

            // max-width: 50vw;
            max-width: clamp(275px, 80vw, 800px);

            hr {
                color: g.$border !important;
                background-color: g.$border !important;
                border-color: g.$border !important;
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

                    .font-awesome-icon, .fa-solid {
                        font-size: 2.2rem;
                        margin-right: 0.5rem;
                    }
                }
            }
        }
    }
</style>