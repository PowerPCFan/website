<script lang="ts">
    import { fade } from "svelte/transition";

    let isMenuOpen = $state(false);

    function toggleMenu() {isMenuOpen = !isMenuOpen}
    function closeMenu() {isMenuOpen = false}
</script>

{#snippet navbarItem(path: string, text: string, onclick?: () => void)}
    <a
        class="w-full md:w-auto max-w-none md:max-w-50 h-auto md:h-full md:inline-block font-bold no-underline text-inherit text-left px-6 py-2 md:px-5 md:mr-1 rounded-none md:squircle-md border-b border-white/10 md:border-b-0 transition-colors duration-300 ease hover:bg-[#bccfff] hover:text-[#171717]"
        href={path}
        onclick={onclick}
    >
        {text}
    </a>
{/snippet}

{#snippet navbarDropdown(name: string, items: Array<{path: string, text: string}>, onclick?: () => void)}
    <div class="group relative w-full md:w-auto max-w-none md:max-w-50 h-auto md:h-full md:inline-block font-bold no-underline text-inherit text-left px-6 py-2 md:px-5 md:mr-1 rounded-none md:squircle-md border-b border-white/10 md:border-b-0 transition-colors duration-300 ease hover:bg-[#bccfff] hover:text-[#171717]">
        <span class="cursor-pointer flex items-center whitespace-nowrap">
            {name} <i class="ml-2 inline-block transition-transform duration-200 group-hover:rotate-180 fa-solid fa-circle-chevron-down"></i>
        </span>
        <div class="absolute top-full left-0 bg-primary border border-[#89abff] rounded shadow-[0_4px_8px_rgba(0,0,0,0.1)] min-w-50 z-1000 opacity-0 invisible -translate-y-2.5 transition-all duration-300 ease group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            {#each items as item}
                <a
                    class="block px-5 py-2 text-[#ebebeb] no-underline font-bold transition-colors duration-300 ease rounded-none first:rounded-t last:rounded-b hover:bg-[#bccfff] hover:text-[#171717]"
                    href={item.path}
                    onclick={onclick}
                >
                    {item.text}
                </a>
            {/each}
        </div>
    </div>
{/snippet}

<header class="sticky top-0 flex flex-row justify-between md:justify-start items-center px-6 py-1 mx-0 my-0 h-fit w-full bg-primary text-foreground z-100">
    <div class="flex md:hidden flex-row justify-center items-center">
        <h1 class="text-xl m-0 py-3 inline-block">
            <a class="no-underline text-inherit hover:no-underline hover:text-inherit focus:no-underline focus:text-inherit active:no-underline active:text-inherit" href="/">PowerPCFan's Website</a>
        </h1>
    </div>
    <div class="flex items-center">
        <button
            class="flex md:hidden items-center justify-center bg-transparent border-none cursor-pointer p-0 size-8 relative z-10003"
            onclick={toggleMenu}
            aria-label="Toggle menu"
        >
            <div class="relative size-full cursor-pointer rounded-full transition-all duration-200 ease-in-out flex items-center justify-center hover:scale-110">
                <div class="absolute w-6 h-0.5 bg-popover-foreground transition-all duration-400 ease-in-out {isMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-2 rotate-0'}"></div>
                <div class="absolute w-6 h-0.5 bg-popover-foreground transition-all duration-400 ease-in-out {isMenuOpen ? '-rotate-45' : 'rotate-0 translate-y-0'}"></div>
                <div class="absolute w-6 h-0.5 bg-popover-foreground transition-all duration-400 ease-in-out translate-y-2 {isMenuOpen ? 'opacity-0' : 'opacity-100'}"></div>
            </div>
        </button>

        <nav class="fixed top-0 right-0 h-screen w-75 bg-[#171717] flex flex-col pt-16 pb-8 shadow-[-2px_0_10px_rgba(0,0,0,0.3)] z-10002 transition-transform duration-350 ease-in-out md:static md:h-auto md:w-auto md:bg-transparent md:flex-row md:flex-wrap md:p-0 md:shadow-none md:z-auto md:translate-x-0 md:transition-none {isMenuOpen ? 'translate-x-0' : 'translate-x-full'}">
            {@render navbarItem("/", "Home", closeMenu)}
            {@render navbarItem("/gallery", "Gallery", closeMenu)}
            {@render navbarItem("https://blog.powerpcfan.xyz/", "Blog", closeMenu)}

            {@render navbarDropdown("Resources", [
                { path: "/resources/pc-resource-document/", text: "PC Resource Document" },
                { path: "/resources/pc-resource-document/install-windows", text: "Installing Windows" },
            ], closeMenu)}

            {@render navbarDropdown("Learn", [
                { path: "/learn/python/", text: "Python" },
            ], closeMenu)}

            {@render navbarDropdown("Project Docs", [
                { path: "/docs/hardwareswap-listing-scraper/", text: "HardwareSwap Listing Scraper" },
                { path: "/docs/kroma/v2", text: "Kroma" },
            ], closeMenu)}

            {@render navbarDropdown("Tools", [
                { path: "/tools/touch-tones/", text: "Phone Touch Tone Simulator" },
                { path: "/tools/sine-wave-soundboard", text: "Sine Wave Soundboard" },
                { path: "/calculators/price-scaler", text: "Price Scaler Calculator" },
                { path: "/tools/travel-timezone-adjustment", text: "Travel Timezone Adjustment" },
            ], closeMenu)}

            <!-- {@render navbarDropdown("Retro Computing", [
                { path: "/retro-computing/start-retro-computing/", text: "Get Started with Retro Computing" },
                { path: "/retro-computing/good-sites/", text: "Good Sites for Old Macs" },
                { path: "/retro-computing/common-issues/", text: "Common Issues with Old Macs" },
            ], closeMenu)} -->
        </nav>

        {#if isMenuOpen}
            <div
                transition:fade={{ duration: 350 }}
                onkeydown={void(0)}
                onclick={closeMenu}
                class="fixed inset-0 w-screen h-screen bg-black/50 z-9999 md:hidden"
                tabindex="-1"
                role="dialog"
                aria-modal="true"
            ></div>   
        {/if}
    </div>
</header>
