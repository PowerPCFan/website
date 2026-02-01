<script lang="ts">
    import { fade } from "svelte/transition";

    let isMenuOpen = $state(false);

    function toggleMenu() {isMenuOpen = !isMenuOpen}
    function closeMenu() {isMenuOpen = false}
</script>

{#snippet navbarItem(path: string, text: string, onclick?: () => void)}
    <a class="navbar-item" href={path} onclick={onclick}>{text}</a>
{/snippet}

{#snippet navbarDropdown(name: string, items: Array<{path: string, text: string}>, onclick?: () => void)}
    <div class="navbar-item navbar-dropdown">
        <span class="navbar-dropdown-trigger">{name} <i class="chevron fa-solid fa-circle-chevron-down"></i></span>
        <div class="navbar-dropdown-menu">
            {#each items as item}
                <a class="navbar-dropdown-item" href={item.path} onclick={onclick}>{item.text}</a>
            {/each}
        </div>
    </div>
{/snippet}

<header>
    <div class="left-side">
        <h1><a href="/">PowerPCFan's Website</a></h1>
    </div>
    <div class="right-side">
        <button class="hamburger-button" class:open={isMenuOpen} onclick={toggleMenu} aria-label="Toggle menu">
            <div class="hamburger-icon">
                <div class="icon-1" class:a={isMenuOpen}></div>
                <div class="icon-2" class:b={isMenuOpen}></div>
                <div class="icon-3" class:c={isMenuOpen}></div>
                <div class="clear"></div>
            </div>
        </button>

        <nav class:open={isMenuOpen}>
            {@render navbarItem("/", "Home", closeMenu)}
            {@render navbarItem("/shop", "Shop", closeMenu)}
            {@render navbarItem("/gallery", "Photography", closeMenu)}
            {@render navbarDropdown("Other Sites", [
                { path: "https://blog.powerpcfan.xyz", text: "Blog" },
                { path: "https://blinkl.ink", text: "BlinkLink" },
                { path: "https://www.opticalmediagood.top", text: "Optical Media Good" }
            ], closeMenu)}
            {@render navbarDropdown("Music", [
                { path: "/music/songs", text: "Song Lyrics/Reviews" },
                { path: "/music/radio", text: "Portal 2 Radio" }
            ], closeMenu)}

            {@render navbarDropdown("Resources", [
                { path: "/resources/pc-resource-document/", text: "PC Resource Document" },
                { path: "/resources/pc-resource-document/install-windows", text: "Installing Windows" },
                { path: "/resources/keys/", text: "Product Keys" }
            ], closeMenu)}

            {@render navbarDropdown("Learn", [
                { path: "/learn/python/", text: "Python" }
            ], closeMenu)}

            {@render navbarDropdown("Project Docs", [
                { path: "/docs/hardwareswap-listing-scraper/", text: "HardwareSwap Listing Scraper" },
                { path: "/docs/kroma/v2", text: "Kroma" }
            ], closeMenu)}

            {@render navbarDropdown("Tools", [
                { path: "/tools/touch-tones/", text: "Phone Touch Tone Simulator" }
            ], closeMenu)}

            {@render navbarDropdown("Retro Computing", [
                { path: "/retro-computing/start-retro-computing/", text: "Get Started with Retro Computing" },
                { path: "/retro-computing/good-sites/", text: "Good Sites for Old Macs" },
                { path: "/retro-computing/common-issues/", text: "Common Issues with Old Macs" }
            ], closeMenu)}
        </nav>

        {#if isMenuOpen}
            <div transition:fade={{ duration: 500 }} onkeydown={void(0)} onclick={closeMenu} class="overlay" tabindex="-1" role="dialog" aria-modal="true"></div>   
        {/if}
    </div>
</header>

<style lang="scss">
    @use "/static/scss/global.scss" as g;
    @use 'sass:color';

    header {
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-inline: 1.5rem;
        padding-block: 0.3rem;
        margin-inline: 0;
        margin-block: 0;
        height: fit-content;
        width: 100%;
        background: g.$primary;
        color: g.$light;
        z-index: 100;
    }

    .left-side {
        display: none;
        flex-direction: row;
        justify-content: center;

        h1 {
            font-size: 1.8rem;
            margin: 0;
            padding-block: 0.7rem;
            display: inline-block;

            a {
                text-decoration: none;
                color: inherit;

                &:hover, &:focus, &:active {
                    text-decoration: none;
                    color: inherit;
                }
            }
        }
    }

    .right-side {
        display: flex;
        align-items: center;

        .hamburger-button {
            display: none;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            width: 2rem;
            height: 2rem;
            position: relative;
            z-index: 10003;

            .hamburger-icon {
                position: relative;
                height: 100%;
                width: 100%;
                cursor: pointer;
                border-radius: 50%;
                transition: all 0.2s ease-in-out;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    transform: scale(1.2);
                }
            }

            .icon-1, .icon-2, .icon-3 {
                position: absolute;
                width: 1.5rem;
                height: 0.120rem;
                background-color: g.$light;
                transition: transform 400ms cubic-bezier(0.84, 0.06, 0.52, 1), opacity 400ms cubic-bezier(0.84, 0.06, 0.52, 1);
            }

            .icon-1 {
                transform: translateY(-8px);

                &.a {
                    transform: rotate(45deg);
                }
            }

            .icon-2 {
                transform: translateY(0);

                &.b {
                    transform: rotate(-45deg);
                }
            }

            .icon-3 {
                transform: translateY(8px);

                &.c {
                    opacity: 0;
                }
            }
        }

        nav {
            display: flex;
            flex-wrap: wrap;

            .navbar-item {
                display: inline-block;
                max-width: 200px;
                height: 100%;

                font-weight: bold;
                text-decoration: none !important;

                color: inherit;

                border-radius: 4px;

                padding-left: 1.2rem;
                padding-right: 1.2rem;

                padding-top: 0.7rem;
                padding-bottom: 0.7rem;

                margin-right: 0.2rem;

                transition: background-color 0.3s ease, color 0.3s ease;

                &:hover {
                    background-color: lighten($color: g.$primary, $amount: 25);
                    color: g.$dark;
                }
            }
        }
    }

    .overlay {
        display: none;
    }

    @media (max-width: 768px) {
        header {
            justify-content: space-between;
        }

        .left-side {
            display: flex;
        }

        .left-side h1 {
            font-size: 1.5rem;
        }
        .right-side {
            .hamburger-button {
                display: flex;
            }

            nav {
                position: fixed;
                top: 0;
                right: 0;
                height: 100vh;
                width: 300px;
                background-color: g.$dark;
                display: flex;
                flex-direction: column;
                padding: 4rem 0 2rem 0;
                box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
                z-index: 10002;
                transform: translateX(100%);
                transition: transform 0.5s cubic-bezier(0.6, 0, 0.4, 1);

                &.open {
                    transform: translateX(0);
                }

                .navbar-item {
                    width: 100%;
                    max-width: none;
                    text-align: left;
                    padding: 0.8rem 1.5rem;
                    height: auto;
                    border-radius: 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

                    &:hover {
                        background-color: lighten($color: g.$primary, $amount: 25);
                        color: g.$dark;
                    }
                }
            }
        }

        .overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(black, 0.5);
            z-index: 9999;
        }
    }

    nav {
        .navbar-dropdown {
            position: relative;
            
            .navbar-dropdown-trigger {
                cursor: pointer;
                display: flex;
                align-items: center;
                white-space: nowrap;

                .chevron {
                    transition: transform 0.2s;
                    margin-left: 0.5rem;
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
                padding: 0.8rem 1.2rem;
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
