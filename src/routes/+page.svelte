<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Home" />

<div id="page-container">
    <h1 id="page-title">Welcome to PowerPCFan's Website</h1>
    <div class="container-thing">
        <h2>About Me</h2>
        <hr />
        <div class="about-me">
            <p>
                Hi, I’m Charlie! I love computers - whether it's building and selling PCs or messing around with hardware. 
                I also love coding and enjoy writing code in Python, Svelte, TypeScript, and PowerShell. 
                I’m also into gaming and my favorite game is probably BeamNG.drive. 
                I love retro tech as well - especially Apple's PowerPC Macs of the 90s-2000s. 
                When I’m not busy with tech stuff, I’m probably listening to music - mainly new wave, rock, or metal.
            </p>
        </div>

        <h2>Links</h2>
        <hr />
        <div class="links">
            <a class="link" href="https://github.com/PowerPCFan/" target="_blank">
                <i class="font-awesome-icon fa-brands fa-square-github"></i>
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
        </div>

        <!-- 88x31s -->
        <h2>88&times;31s</h2>
        <hr />
        <div class="box-88x31">
            <div class="grid-88x31">
                <a href="https://www.apple.com/mac/">
                    <img alt="Made with Macintosh" src="/images/home/88x31/madewithmac.gif" />
                </a>
                <a href="https://www.mozilla.org/en-US/firefox/new">
                    <img alt="Tested on Firefox" src="/images/home/88x31/firefox.gif" />
                </a>
                <a href="https://amazon.com">
                    <img alt="Amazon.com" src="/images/home/88x31/amazon.gif" />
                </a>
                <a href="https://google.com">
                    <img alt="Google" src="/images/home/88x31/google.gif" />
                </a>
                <a href="https://en.wikipedia.org/wiki/Netscape_Navigator">
                    <img alt="Netscape Navigator" src="/images/home/88x31/netscape.gif" />
                </a>
                <a href="https://www.nvidia.com/en-us/">
                    <img alt="Nvidia" src="/images/home/88x31/nvidia.gif" />
                </a>
                <a href="https://en.wikipedia.org/wiki/Sun_Microsystems">
                    <img alt="Sun Microsystems" src="/images/home/88x31/sun.gif" />
                </a>
                <a href="https://en.wikipedia.org/wiki/Windows_Media_Player">
                    <img alt="Windows Media Player" src="/images/home/88x31/windowsmediaplayer.gif" />
                </a>
                <a href="https://www.rarlab.com/download.htm">
                    <img alt="WinRAR" src="/images/home/88x31/winrar.gif" />
                </a>
            </div>
        </div>
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

                    display: flex;
                    align-items: center;
                    flex-direction: row;

                    .font-awesome-icon {
                        font-size: 2.2rem;
                        margin-right: 0.5rem;
                    }
                }
            }

            // .box-88x31 {
            //     display: flex;
            //     justify-content: center; // Centers the box on the page 
            //     align-items: center;

            //     .grid-88x31 {
            //         display: grid;
            //         grid-template-columns: repeat(4, 88px);
            //         row-gap: 2px;
            //         column-gap: 6px;
            //         justify-content: center;
            //         padding: 0;
            //         margin: 0;

            //         img {
            //             image-rendering: pixelated !important;
            //             width: 88px !important;
            //             height: 31px !important;
            //             transition: transform 0.2s;
            //             border: 1px solid transparent;
            //             margin: 0; // Remove extra margin 

            //             &:hover {
            //                 filter: brightness(1.1);
            //                 transform: scale(1.1);
            //                 box-shadow: (
            //                     0 1px 1px rgba(0,0,0,0.11),
            //                     0 2px 2px rgba(0,0,0,0.11),
            //                     0 4px 4px rgba(0,0,0,0.11),
            //                     0 8px 8px rgba(0,0,0,0.11),
            //                     0 16px 16px rgba(0,0,0,0.11),
            //                     0 32px 32px rgba(0,0,0,0.11)
            //                 );
            //             }
            //         }
            //     }
            // }

            .box-88x31 {
                margin-top: 2rem;

                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                .grid-88x31 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, 88px);
                    gap: 2px 6px;
                    justify-content: center;
                    padding: 0;
                    margin: 0;

                    max-width: calc(88px * 5 + 6px * 4);
                    min-width: calc(88px * 2 + 6px * 1);

                    img {
                        image-rendering: pixelated !important;
                        width: 88px !important;
                        height: 31px !important;
                        transition: transform 0.2s;
                        border: 1px solid transparent;
                        margin: 0;

                        &:hover {
                            filter: brightness(1.1);
                            transform: scale(1.1);
                            box-shadow:
                                0 1px 1px rgba(0, 0, 0, 0.11),
                                0 2px 2px rgba(0, 0, 0, 0.11),
                                0 4px 4px rgba(0, 0, 0, 0.11),
                                0 8px 8px rgba(0, 0, 0, 0.11),
                                0 16px 16px rgba(0, 0, 0, 0.11),
                                0 32px 32px rgba(0, 0, 0, 0.11);
                        }
                    }
                }
            }

        }
    }
</style>