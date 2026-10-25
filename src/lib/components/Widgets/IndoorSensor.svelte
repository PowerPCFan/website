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
    import type { Conditions, SensorData, Thresholds } from "$lib/utils/sensors.js";

    let isLoading: boolean = $state(true);
    let currentData: SensorData | null = $state(null);

    $effect(() => {
        console.log(currentData);
    });

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
</script>

{#snippet metric(label: string, value: number, unit: string, thresholds: Thresholds, decimalPlaces: number = 0, thresholdValue: number | undefined = undefined)}
    {@const thres = getThresholdFromValue(thresholds, thresholdValue ?? value)}
    {@const dispVal = roundTo(value, decimalPlaces)}

    <div class="bg-white/5 p-2 squircle-xs flex flex-col items-center">
        <div class="text-base text-center leading-tight">
            <div class="font-semibold text-sm">{@html label}</div>
            <div class="{thres.color ? thres.color : ''}">{dispVal}{unit}</div>
        </div>
        <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
            <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
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
            <div class="flex flex-row gap-2 w-full">
                <div class="bg-white/5 squircle-xs flex flex-col items-center justify-center w-32 h-auto gap-1">
                    <span class="text-6xl">🏡</span>
                    <p class="text-sm">My Bedroom</p>
                </div>

                <div class="flex-1 gap-2 grid grid-cols-2">
                    {@render metric("Temperature", currentData?.indoor.temperature * (9 / 5) + 32, "ºF", INDOOR_TEMP_THRESHOLDS)}
                    {@render metric("Humidity", currentData?.indoor.humidity, "%", HUMIDITY_THRESHOLDS)}
                    {@render metric("Pressure", currentData?.indoor.pressure * 0.02953, " inHg", OUTDOOR_PRESSURE_THRESHOLDS, 2, currentData?.indoor.pressure)}
                    {@render metric("CO<sub>2</sub>", currentData?.indoor.carbon_dioxide, " ppm", CO2_THRESHOLDS)}
                    {@render metric("VOC Index", currentData?.indoor.vocs, "", VOCS)}
                    {@render metric("Connection", currentData?.indoor.wifi_strength, " dBm", ESP32_WIFI_THRESHOLDS)}
                </div>
            </div>

            <Card.Footer class="h-full flex flex-col justify-end">
                <p class="m-0 mt-2 -mb-2 text-xs w-full">Last updated: <span class="font-semibold">{formatDate(currentData?.indoor.time)}</span></p>
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
