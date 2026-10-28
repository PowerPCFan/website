<script lang="ts">
    import { onMount } from "svelte";
    import CircularStatusIndicator from "$lib/components/Card/Utilities/CircularStatusIndicator.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        fetchData,
        getThresholdFromValue,
        ESP32_WIFI_THRESHOLDS,
        INDOOR_TEMP_THRESHOLDS,
        HUMIDITY_THRESHOLDS,
        OUTDOOR_PRESSURE_THRESHOLDS,
        CO2_THRESHOLDS,
        formatDate,
        VOCS,
    } from "$lib/utils/sensors.js";
    import type { SensorData, Thresholds } from "$lib/utils/sensors.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { MediaQuery } from 'svelte/reactivity';
    import * as Popover from "$lib/components/ui/popover/index.js";

    const touchscreen = new MediaQuery('(pointer: coarse)');
    let isMobile: boolean = $derived(touchscreen.current);

    let isLoading: boolean = $state(true);
    let currentData: SensorData | null = $state(null);

    function roundTo (num: number, digits: number): number {
        // @ts-expect-error
        return Number(Math.round(num + "e" + digits) + "e-" + digits);
    };

    async function loadData() {
        try {
            currentData = await fetchData();
        } catch (e) {
            currentData = null;
        }
    }

    onMount(async () => {
        await loadData();
        isLoading = false;
        setInterval(loadData, 5 * 60 * 1000); // 5 minutes
    });

    // tempDial stuff
    // todo: move this to its own component
    // also organize other indoorsensor/outdoorsensor-exclusive component into some sort of Weather/ dir or somethin
    type Threshold = {
        upTo: number;
        text: string;
    };

    const thresholds: Threshold[] = [
        { upTo: 65, text: 'text-blue-500' },
        { upTo: 71, text: 'text-green-500' },
        { upTo: 77, text: 'text-amber-500' },
        { upTo: Infinity, text: 'text-red-500' },
    ];

    const min = 59;
    const max = 83;
    const sweep = 270;
    const gap = 2;

    function getActive(value: number) {
        return thresholds.find((t) => value < t.upTo) ?? thresholds[thresholds.length - 1];
    }

    function getFraction(value: number) {
        return Math.max(0, Math.min(1, (value - min) / (max - min)));
    }

    function getBands(fraction: number) {
        return thresholds.map((t, i) => {
            const start = i === 0 ? min : Math.min(max, thresholds[i - 1].upTo);
            const end = Math.min(max, t.upTo);
            const s = (start - min) / (max - min);
            const e = (end - min) / (max - min);
            const from = s * sweep + (i === 0 ? 0 : gap / 2);
            const to = e * sweep - (end >= max ? 0 : gap / 2);
            const litTo = Math.max(from, Math.min(to, fraction * sweep));
            return { text: t.text, from, to, litTo, valid: end > start };
        }).filter((b) => b.valid);
    }

    function arc(from: number, to: number) {
        return `conic-gradient(from ${360 - sweep / 2}deg, transparent 0deg ${from}deg, currentColor ${from}deg ${to}deg, transparent ${to}deg 360deg)`;
    }
</script>

{#snippet tempDial(value: number)}
    {@const active = getActive(value)}
    {@const fraction = getFraction(value)}
    {@const markerAngle = -sweep / 2 + fraction * sweep}
    {@const bands = getBands(fraction)}
    {@const ringMask = "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px), #000 calc(100% - 0.5px), transparent 100%)"}

    <div class="relative shrink-0 rounded-full bg-gray-800 size-20">
        {#each bands as band}
            <div
                class="absolute rounded-full inset-1 opacity-25 {band.text}"
                style="background: {arc(band.from, band.to)}; mask: {ringMask}; -webkit-mask: {ringMask};"
            ></div>
            <div
                class="absolute rounded-full inset-1 {band.text}"
                style="background: {arc(band.from, band.litTo)}; mask: {ringMask}; -webkit-mask: {ringMask};"
            ></div>
        {/each}

        <div
            class="absolute inset-1"
            style="transform: rotate({markerAngle}deg);"
        >
            <div class="mx-auto rounded-full bg-gray-100 ring-2 ring-gray-800 -mt-0.5 h-2.5 w-1"></div>
        </div>

        <div class="absolute inset-0 top-2 flex flex-col items-center justify-center">
            <div class="font-semibold leading-none tabular-nums text-xl {active.text}">{value}</div>
            <div class="font-medium text-gray-400 text-[10px]">°F</div>
        </div>
    </div>
{/snippet}

{#snippet metric(label: string, value: number, unit: string, thresholds: Thresholds, decimalPlaces: number = 0, thresholdValue: number | undefined = undefined)}
    {@const thres = getThresholdFromValue(thresholds, thresholdValue ?? value)}
    {@const dispVal = roundTo(value, decimalPlaces)}

    <div class="text-base text-center leading-tight">
        <div class="font-semibold text-sm">{@html label}</div>
        <div class="{thres.color ? thres.color : ''}">{dispVal}{unit}</div>
    </div>
    <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
        <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
    </div>
{/snippet}

{#if isLoading}
    <Card.Root class="h-full">
        <Card.Header class="flex flex-row items-center gap-3 mb-4">
            <CircularStatusIndicator loading />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">Loading indoor weather...</p>
        </Card.Header>
    </Card.Root>
{:else if currentData}
    <Card.Root class="h-full max-w-100">
        <Card.Header class="flex flex-row items-center gap-3">
            <CircularStatusIndicator green />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">Indoors</p>
        </Card.Header>

        <Card.Content class="flex flex-col items-center gap-2 h-full">
            <p class="m-0 -mb-1 text-xs w-full text-muted-foreground">Indoor Climate</p>
            <div class="w-full">
                <div class="flex-1 gap-2 grid grid-cols-2">
                    <div class="bg-white/5 p-2 squircle-xs flex flex-col items-center justify-center gap-1">
                        {#if true}
                            {const dispVal = roundTo(currentData?.indoor.temperature * (9 / 5) + 32, 0)}
                            {const thres = getThresholdFromValue(INDOOR_TEMP_THRESHOLDS, dispVal)}

                            <div class="flex flex-col items-center">
                                <div class="text-base text-center leading-tight flex flex-col items-center">
                                    <div class="font-semibold text-sm">Temperature</div>
                                    {@render tempDial(dispVal)}
                                </div>
                                <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
                                    <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
                                </div>
                            </div>
                        {/if}
                    </div>
                    <div class="bg-white/5 p-2 squircle-xs flex flex-row items-center">
                        <div class="flex flex-col items-center w-full">
                            {@render metric("Humidity", currentData?.indoor.humidity, "%", HUMIDITY_THRESHOLDS)}
                        </div>
                    </div>
                    <div class="bg-white/5 p-2 squircle-xs flex flex-row items-center">
                        <div class="flex flex-col items-center w-full">
                            {@render metric("Pressure", currentData?.indoor.pressure * 0.02953, " inHg", OUTDOOR_PRESSURE_THRESHOLDS, 2, currentData?.indoor.pressure)}
                        </div>
                    </div>
                    <div class="bg-white/5 p-2 squircle-xs flex flex-row items-center">
                        <div class="flex flex-col items-center w-full">
                            {@render metric("CO<sub>2</sub>", currentData?.indoor.carbon_dioxide, " ppm", CO2_THRESHOLDS)}
                        </div>
                    </div>
                    <div class="bg-white/5 p-2 squircle-xs flex flex-row items-center">
                        <div class="flex flex-col items-center w-full">
                            {@render metric("VOC Index", currentData?.indoor.vocs, "", VOCS)}
                        </div>
                    </div>
                    <div class="bg-white/5 p-2 squircle-xs flex flex-row items-center">
                        <div class="flex flex-col items-center w-full">
                            {@render metric("Connection", currentData?.indoor.wifi_strength, " dBm", ESP32_WIFI_THRESHOLDS)}
                        </div>
                    </div>
                </div>
            </div>

            <Card.Footer class="h-full flex flex-col justify-end">
                <p class="m-0 mt-2 -mb-2 text-xs w-full">Last updated: <span class="font-semibold">{formatDate(currentData?.indoor.time)}</span></p>
                {#if isMobile}
                    <Popover.Root>
                        <Popover.Trigger>
                            <p class="m-0 mt-2 -mb-2 text-[0.65rem] italic w-full underline underline-offset-2 decoration-dotted">Tap to view sources</p>
                        </Popover.Trigger>
                        <Popover.Content>
                            <ul class="pl-2">
                                <li>All data: <span class="font-semibold">my DIY indoor sensor</span></li>
                            </ul>
                        </Popover.Content>
                    </Popover.Root>
                {:else}
                    <Tooltip.Root>
                        <Tooltip.Trigger>
                            <p class="m-0 mt-2 -mb-2 text-[0.65rem] italic w-full underline underline-offset-2 decoration-dotted">Hover to view sources</p>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <ul class="pl-2">
                                <li>All data: <span class="font-semibold">my DIY indoor sensor</span></li>
                            </ul>
                        </Tooltip.Content>
                    </Tooltip.Root>
                {/if}
            </Card.Footer>
        </Card.Content>
    </Card.Root>
{:else}
    <Card.Root class="h-full ring-destructive gap-0">
        <Card.Header class="flex flex-row items-center gap-3 mb-4">
            <CircularStatusIndicator error />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">Error loading indoor weather</p>
        </Card.Header>
        <Card.Content>
            <div class="italic text-sm text-muted-foreground">Please try again later.</div>
        </Card.Content>
    </Card.Root>
{/if}
