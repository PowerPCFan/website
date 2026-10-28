<script lang="ts">
    import { onMount } from "svelte";
    import CircularStatusIndicator from "$lib/components/Card/Utilities/CircularStatusIndicator.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import MetricDial from "../MetricDial.svelte";
    import DropletGauge from "../DropletGauge.svelte";
    import WifiBars from "../WifiBars.svelte";
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

</script>

{#snippet dialCard(label: string, value: number, unit: string, thresholds: Thresholds, min: number, max: number, decimalPlaces = 0)}
    {@const thres = getThresholdFromValue(thresholds, value)}
    <div class="bg-white/5 p-2 squircle-xs flex flex-col items-center justify-center gap-1">
        <div class="flex flex-col items-center gap-1">
            <div class="text-base text-center leading-tight flex flex-col items-center">
                <div class="font-semibold text-sm">{@html label}</div>
                <MetricDial
                    {value}
                    {unit}
                    {thresholds}
                    {min}
                    {max}
                    {decimalPlaces}
                />
            </div>
            <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
                <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
            </div>
        </div>
    </div>
{/snippet}

{#snippet dropletCard(label: string, value: number, thresholds: Thresholds)}
    {@const thres = getThresholdFromValue(thresholds, value)}
    <div class="bg-white/5 p-2 squircle-xs flex flex-col items-center justify-center gap-1">
        <div class="flex flex-col items-center gap-1">
            <div class="text-base text-center leading-tight flex flex-col items-center">
                <div class="font-semibold text-sm">{@html label}</div>
                <DropletGauge {value} />
            </div>
            <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
                <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
            </div>
        </div>
    </div>
{/snippet}

{#snippet wifiCard(label: string, rssi: number)}
    {@const thres = getThresholdFromValue(ESP32_WIFI_THRESHOLDS, rssi)}
    <div class="bg-white/5 p-2 squircle-xs flex flex-col items-center justify-center gap-1">
        <div class="flex flex-col items-center">
            <div class="text-base text-center leading-tight flex flex-col items-center">
                <div class="font-semibold text-sm">{label}</div>
                <WifiBars {rssi} />
            </div>
            <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
                <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
            </div>
        </div>
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
                    {@render dialCard("Temperature", currentData.indoor.temperature * (9 / 5) + 32, "°F", INDOOR_TEMP_THRESHOLDS, 59, 83, 0)}
                    {@render dropletCard("Humidity", currentData.indoor.humidity, HUMIDITY_THRESHOLDS)}
                    {@render dialCard("Pressure", currentData.indoor.pressure * 0.02953, "inHg", OUTDOOR_PRESSURE_THRESHOLDS, 28.7, 30.7, 2)}
                    {@render dialCard("CO<sub>2</sub>", currentData.indoor.carbon_dioxide, "ppm", CO2_THRESHOLDS, 300, 2000, 0)}
                    {@render dialCard("VOC Index", currentData.indoor.vocs, "", VOCS, 0, 500, 0)}
                    {@render wifiCard("Connection", currentData.indoor.wifi_strength)}
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
