<script lang="ts">
</script>

{#snippet navbarItem(path: string, text: string)}
    <a class="navbar-item" href={path}>{text}</a>
{/snippet}

{#snippet navbarDropdown(name: string, items: Array<{path: string, text: string}>)}
    <div class="navbar-item navbar-dropdown">
        <span class="navbar-dropdown-trigger">{name} <i class="chevron fa-solid fa-circle-chevron-down"></i></span>
        <div class="navbar-dropdown-menu">
            {#each items as item}
                <a class="navbar-dropdown-item" href={item.path}>{item.text}</a>
            {/each}
        </div>
    </div>
{/snippet}

<header>
    <nav>
        {@render navbarItem("/", "Home")}
        {@render navbarItem("/shop", "Shop")}
        {@render navbarItem("/gallery", "Photography")}
        {@render navbarDropdown("Other Sites", [
            { path: "https://blog.powerpcfan.xyz", text: "Blog" },
            { path: "https://blinkl.ink", text: "BlinkLink" },
            { path: "https://www.opticalmediagood.top", text: "Optical Media Good" }
        ])}
        {@render navbarDropdown("Music", [
            { path: "/music/songs", text: "Song Lyrics/Reviews" }
        ])}

        {@render navbarDropdown("Resources", [
            { path: "/resources/pc-resource-document/", text: "PC Resource Document" },
            { path: "/resources/pc-resource-document/install-windows", text: "Installing Windows" },
            { path: "/resources/keys/", text: "Product Keys" }
        ])}

        {@render navbarDropdown("Learn", [
            { path: "/learn/python/", text: "Python" }
        ])}

        {@render navbarDropdown("Project Docs", [
            { path: "/docs/hardwareswap-listing-scraper/", text: "HardwareSwap Listing Scraper" },
            { path: "/docs/kroma/v2", text: "Kroma" }
        ])}

        {@render navbarDropdown("Tools", [
            { path: "/tools/touch-tones/", text: "Phone Touch Tone Simulator" }
        ])}

        {@render navbarDropdown("Retro Computing", [
            { path: "/retro-computing/start-retro-computing/", text: "Get Started with Retro Computing" },
            { path: "/retro-computing/good-sites/", text: "Good Sites for Old Macs" },
            { path: "/retro-computing/common-issues/", text: "Common Issues with Old Macs" }
        ])}
    </nav>
</header>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    $navbar-item-padding: 1.2rem;

    header {
        background: g.$primary;
        color: g.$light;
        padding: 0.3rem $navbar-item-padding;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    nav {
        .navbar-item {
            display: inline-block;

            // commented this out since idk why it was ever here to begin with
            // seems to be fine w/out it
            // max-width: calc(200px + #{$navbar-item-padding * 2});

            height: 100%;

            font-weight: bold;
            text-decoration: none !important;

            color: inherit;

            border-radius: 4px;

            padding-left: $navbar-item-padding;
            padding-right: $navbar-item-padding;

            padding-top: 0.7rem;
            padding-bottom: 0.7rem;

            transition: background-color 0.3s ease, color 0.3s ease;
            
            &:hover {
                background-color: lighten($color: g.$primary, $amount: 25);
                color: g.$dark;
            }
        }

        .navbar-dropdown {
            position: relative;
            
            .navbar-dropdown-trigger {
                cursor: pointer;
                display: block;

                .chevron {
                    transition: transform 0.2s;
                }
            }

            &:hover {
                .navbar-dropdown-trigger .chevron {
                    transform: rotate(180deg);
                }
            }

            .navbar-dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                background: g.$primary;
                border: 1px solid lighten($color: g.$primary, $amount: 15);
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                min-width: 200px;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
            }

            &:hover .navbar-dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .navbar-dropdown-item {
                display: block;
                padding: 0.8rem $navbar-item-padding;
                color: g.$light;
                text-decoration: none !important;
                font-weight: bold;
                transition: background-color 0.3s ease, color 0.3s ease;
                border-radius: 0;

                &:hover {
                    background-color: lighten($color: g.$primary, $amount: 25);
                    color: g.$dark;
                }

                &:first-child {
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                }

                &:last-child {
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }
        }
    }
</style>
