<script lang="ts">
    import ContactMethod from "$lib/components/ContactMethod.svelte";
    import Project from "$lib/components/Project.svelte";
    import Site88x31s from "$lib/components/site88x31s.svelte";
    import Title from "$lib/components/title.svelte";
    import NowPlaying from "$lib/components/Widgets/NowPlaying.svelte";
    import TimeWidget from "$lib/components/Widgets/TimeWidget.svelte";
    import VSCodeStatus from "$lib/components/Widgets/VSCodeStatus.svelte";
    import Countdown from "$lib/components/Widgets/Countdown.svelte";
    import OutdoorSensor from "$lib/components/Widgets/OutdoorSensor.svelte";
  import IndoorSensor from "$lib/components/Widgets/IndoorSensor.svelte";
  import AbuseIPDB from "$lib/components/AbuseIPDB.svelte";

    let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<Title title="Home" />

<div class="[&>div]:p-4 [&>div]:md:p-8 [&>div]:lg:p-16 [&div>]:xl:p-32">
    <div id="introduction" class="bg flex h-[90vh] w-screen items-start sm:items-center">
        <div class="hidden sm:block flex-1 w-full"></div>
        <div
            class="mr-4 w-full h-min max-w-lg squircle-md bg-black/30 p-6 outline-1 outline-white/20 backdrop-blur-md md:mb-24 lg:mb-38"
        >
            <h1 class="text-4xl!">Welcome</h1>
            <h2 class="mb-1! text-2xl! font-medium opacity-85 leading-tight">
                I'm PowerPCFan, a developer and computer enthusiast
            </h2>

            <div class="mt-4 flex flex-row gap-3">
                <ContactMethod link="https://github.com/PowerPCFan/" />
                <ContactMethod link="mailto:charlie@powerpcfan.xyz" />
                <ContactMethod link="https://steamcommunity.com/profiles/76561199516243582" />
                <ContactMethod link="https://youtube.com/@charliesretrocomputing/" />
                <ContactMethod link="https://open.spotify.com/user/31nmpykqw3mfa7luhps4bchppusy" />
            </div>
        </div>
    </div>

    <div class="bg flex flex-col items-center" id="projects">
        <div class="max-w-300">
            <h2>Project showcase</h2>

            <div class="flex flex-col md:flex-row md:justify-between pt-8 pb-12 md:pb-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-12 xl:gap-9">
                    <Project
                        name="eepy.page"
                        description="A free subdomain registrar. It uses a SvelteKit frontend and a Python backend to manipulate DNS records on my PowerDNS instance. This project has been extremely valuable for teaching me about networking, DNS, server administration, and managing complex, full-stack applications like this."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/eepy.page-frontend" />
                        <ContactMethod link="https://github.com/PowerPCFan/eepy.page-backend" />
                        <ContactMethod link="https://github.com/PowerPCFan/eepy.page-admin-panel" />
                        <ContactMethod link="https://www.eepy.page" />
                    </Project>

                    <Project
                        name="PC Flipper Windows Script"
                        description="One of my older but updated projects, the PC Flipper Windows Script helps PC flippers set up a Windows installation quickly. This project taught me a lot about Windows administration, scripting, automation, and programming in general."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/pc-flipper-windows-script" />
                    </Project>

                    <Project
                        name="eBay Listing Scraper"
                        description="A tool that searches eBay for PC part listings that match a certain criteria, to help flippers find good deals on items. Taught me about interacting with existing APIs, managing states, and working with precise configuration to ensure listings meet criteria."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/ebay-listing-scraper-discord-pings" />
                    </Project>

                    <Project
                        name="SensorProject"
                        description="The all-encompassing term for the various &quot;Sensor Projects&quot; I've done, with ESP32s, sensors, APIs, and more. These projects taught me a lot about embedded systems, IoT, working with hardware, and integrating multiple systems together to create a fully functional solution."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/SensorProject" />
                    </Project>

                    <Project
                        name="r/HardwareSwap Listing Scraper"
                        description="A tool that searches the HardwareSwap subreddit for posts that match specific criteria. Proved to be challenging since each poster formats their posts differently, so there was no way to parse items properly, but this project taught me about working with APIs and making the best of imperfect data."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/hardwareswap-listing-scraper" />
                        <ContactMethod link="https://github.com/PowerPCFan/hardwareswap-listing-scraper-discord-pings" />
                    </Project>

                    <Project
                        name="VSCode Status"
                        description="An all-in-one solution for uploading and retrieving your current VSCode status to an API. The VSCode extension pushes updates to a POST endpoint, and there is a public GET endpoint to retrieve the status. Taught me about creating public APIs and handling real-time updates. Scroll down a bit to see it in action in the 'Fun stuff' section!"
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/vscode-status-api" />
                    </Project>

                    <Project
                        name="Kroma"
                        description="A lightweight and powerful Python library for formatting terminal output. Through this project, I learned about ANSI escape codes, working around terminal quirks, and creating Python libraries."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/kroma" />
                    </Project>

                    <Project
                        name="Website"
                        description="None other than this site! My oldest project by far, dating back to a time where I knew not a thing about programming, however most of its history is lost since I was at the stage where I was using Notepad and .zip files to edit and store code, not Git. :)"
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/hardwareswap-listing-scraper" />
                    </Project>

                    <Project
                        name="BlinkLink"
                        description="A simple URL shortener service that converts URLs to blinkl.ink URLs (e.g. blinkl.ink/Abc123). Although it's a bit rough around the edges, it's one of my earlier Svelte projects, and it was a good learning experience when it comes to building web apps."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/url-shortener" />
                        <ContactMethod link="https://blinkl.ink/" />
                    </Project>

                    <Project
                        name="BlinkBin"
                        description="The sister project of BlinkLink. A zero-authentication pastebin service that uses proof-of-work verification for file uploads. Taught me about implementing security mechanisms while keeping an API authentication-free."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/BlinkBin" />
                        <ContactMethod link="https://bin.blinkl.ink/" />
                    </Project>

                    <Project
                        name="Optical Media Good"
                        description="A joke site I built for fun (project name is a Bringus Studios reference). Allowed me to experience the painful process of making modern CSS and JavaScript compatible with archaic browsers."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/optical-media-good" />
                    </Project>

                    <!-- <Project
                        name="Ruff Rule Browser"
                        description="A VSCode extension that adds a Quick Fix to Ruff errors that, when clicked, opens the Ruff rule documentation inside VSCode. Taught me how to build tools to improve your workflow when you're working with limited hardware."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/ruff-browser" />
                    </Project> -->

                    <Project
                        name="GlowControl"
                        description="A native DDC/CI control app for systems running KDE Plasma + Wayland with compatible monitors. Taught me about interacting with peripherals and integrating with system APIs to provide native dialogs and OSDs."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/GlowControl" />
                    </Project>

                    <!-- <Project
                        name="KDE Wayland Color Picker"
                        description="A basic tool that opens a native color selector tool to get the HEX code from any color on your screen. This taught me about interacting with KDE APIs and D-Bus, and improved my C++ skills."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/kde-wayland-color-picker" />
                    </Project> -->

                    <!-- <Project
                        name="Betterfox Installer"
                        description="A PowerShell script that installs the Betterfox tweaks for Firefox into your Firefox profile."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/new-project" />
                    </Project> -->

                    <!-- <Project
                        name="Windows Wallpaper Switcher"
                        description="A tool that switches your Windows wallpaper to any wallpaper out of a list of predefined wallpapers. Although not the most useful tool, creating this taught me how to make C++ GUI apps and how to work with Win32 APIs."
                    >
                        <ContactMethod link="https://github.com/PowerPCFan/WindowsWallpaperSwitcher" />
                    </Project> -->
                </div>
            </div>
            <div class="text-center">
                <h2>...and more!</h2>
                <p class="text-sm">(Check out my <a href="https://github.com/PowerPCFan">GitHub</a> page)</p>
            </div>
        </div>
    </div>

    <div class="bg flex flex-col items-center" id="fun">
        <div class="max-w-300">
            <h2>Fun stuff</h2>
            <div class="widget-grid mt-4 items-stretch gap-5 grid grid-cols-1 md:grid-cols-2">
                <div class="flex flex-col w-full h-full gap-2">
                    <h3 class="font-semibold! text-2xl!">Last.fm</h3>
                    <NowPlaying username="PowerPCFan" />
                </div>

                <div class="flex flex-col w-full h-full gap-2">
                    <h3 class="font-semibold! text-2xl!">VSCode Status</h3>
                    <VSCodeStatus userId="3818207096435605" />
                </div>

                <div class="flex flex-col w-full h-full gap-2">
                    <h3 class="font-semibold! text-2xl!">Outdoor Sensor</h3>
                    <OutdoorSensor />
                </div>

                <div class="flex flex-col w-full h-full gap-2">
                    <h3 class="font-semibold! text-2xl!">Indoor Sensor</h3>
                    <IndoorSensor />
                </div>

                <div class="flex flex-col w-full h-full gap-2">
                    <h3 class="font-semibold! text-2xl!">World Clock</h3>
                    <TimeWidget />
                </div>

                <div class="flex flex-col w-full h-full gap-2">
                    <h3 class="font-semibold! text-2xl!">Countdown</h3>
                    <Countdown />
                </div>
            </div>
        </div>
    </div>

    <div class="bg flex flex-col items-center gap-6" id="badges">
        <AbuseIPDB userId={329516} />
        <Site88x31s />
        <p class="text-xs">&copy; 2026 PowerPCFan</p>
    </div>
</div>

<style>
    :root {
        --vignette: radial-gradient(
            ellipse 200% 50% at center,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.5) 60%,
            rgba(0, 0, 0, 1) 100%
        );
        --vignette-linear-bottomonly: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.5) 60%,
            rgba(0, 0, 0, 1) 100%
        );
        --vignette-linear: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.5) 20%,
            rgba(0, 0, 0, 0.5) 80%,
            rgba(0, 0, 0, 1) 100%
        );
    }

    #introduction {
        background-image:
            var(--vignette-linear-bottomonly),
            url("/images/gallery/17.jpg"),
            url("/images/gallery/17-thumbnail.webp");
    }

    #projects {
        background-image:
            var(--vignette-linear),
            url("/images/gallery/13.jpg"),
            url("/images/gallery/13-thumbnail.webp");
    }

    #fun {
        background-image:
            var(--vignette-linear),
            url("/images/gallery/4.jpg"),
            url("/images/gallery/4-thumbnail.webp");
    }

    #badges {
        background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20000' height='20000' fill='%23000000'/%3E%3C/svg%3E");
    }

    .bg {
        background-size: cover;
        background-position: center;
    }
</style>
