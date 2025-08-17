<div class="box-88x31">
    <div class="grid-88x31">
        <a target="_blank" href="https://www.powerpcfan.xyz">
            <img alt="PowerPCFan" src="/images/88x31/powerpcfan-88x31-new.png" />
        </a>
        <a target="_blank" href="https://www.apple.com/mac/">
            <img alt="Made with Macintosh" src="/images/88x31/madewithmac.gif" />
        </a>
        <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new">
            <img alt="Tested on Firefox" src="/images/88x31/firefox.gif" />
        </a>
        <a target="_blank" href="https://amazon.com">
            <img alt="Amazon.com" src="/images/88x31/amazon.gif" />
        </a>
        <a target="_blank" href="https://google.com">
            <img alt="Google" src="/images/88x31/google.gif" />
        </a>
        <a target="_blank" href="https://en.wikipedia.org/wiki/Netscape_Navigator">
            <img alt="Netscape Navigator" src="/images/88x31/netscape.gif" />
        </a>
        <a target="_blank" href="https://www.nvidia.com/en-us/">
            <img alt="Nvidia" src="/images/88x31/nvidia.gif" />
        </a>
        <a target="_blank" href="https://en.wikipedia.org/wiki/Sun_Microsystems">
            <img alt="Sun Microsystems" src="/images/88x31/sun.gif" />
        </a>
        <a target="_blank" href="https://en.wikipedia.org/wiki/Windows_Media_Player">
            <img alt="Windows Media Player" src="/images/88x31/windowsmediaplayer.gif" />
        </a>
        <a target="_blank" href="https://www.rarlab.com/download.htm">
            <img alt="WinRAR" src="/images/88x31/winrar.gif" />
        </a>
        <a target="_blank" href="https://www.frii.site">
            <img alt="frii.site" src="/images/88x31/frii-site.png" />
        </a>
    </div>
</div>

<style lang="scss">
    .box-88x31 {
        margin-top: 2rem;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .grid-88x31 {
            display: grid;
            grid-template-columns: repeat(5, 88px);
            gap: 2px 6px;
            justify-content: center;
            padding: 0;
            margin: 0;

            @media (max-width: 520px) {grid-template-columns: repeat(4, 88px)}
            @media (max-width: 416px) {grid-template-columns: repeat(3, 88px)}
            @media (max-width: 312px) {grid-template-columns: repeat(2, 88px)}

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
</style>