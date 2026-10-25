<script lang="ts">
    import { onMount } from "svelte";
    import CircularStatusIndicator from "$lib/components/Card/Utilities/CircularStatusIndicator.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        fetchData,
        getThresholdFromValue,
        OUTDOOR_TEMP_THRESHOLDS,
        OUTDOOR_HUMIDITY_THRESHOLDS,
        OUTDOOR_DEW_POINT_THRESHOLDS,
        OUTDOOR_PRESSURE_THRESHOLDS,
        ESP32_TEMP_THRESHOLDS,
        ESP32_WIFI_THRESHOLDS,
        ESP32_VOLT_THRESHOLDS,
        ESP32_INTERNAL_TEMPERATURE,
        ESP32_INTERNAL_HUMIDITY,
        fetchConditions,
        formatDate,
    } from "$lib/utils/sensors.js";
    import type { Conditions, SensorData, Thresholds } from "$lib/utils/sensors.js";

    let isLoading: boolean = $state(true);
    let currentData: SensorData | null = $state(null);
    let currentConditions: Conditions | null = $state(null);

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

        try {
            currentConditions = await fetchConditions();
        } catch (e) {
            currentConditions = null;
        }
    }

    onMount(async () => {
        await loadData();
        isLoading = false;
        setInterval(loadData, 5 * 60 * 1000); // 5 minutes
    });
</script>

{#snippet metric(label: string, value: number, unit: string, thresholds: Thresholds, decimalPlaces: number = 0, thresholdValue: number | undefined = undefined, esp32metric: boolean = false)}
    {@const thres = getThresholdFromValue(thresholds, thresholdValue ?? value)}
    {@const dispVal = roundTo(value, decimalPlaces)}

    {#if !esp32metric}
        <div class="bg-white/5 p-2 squircle-xs flex flex-col items-center">
            <div class="text-base text-center leading-tight">
                <div class="font-semibold text-sm">{label}</div>
                <div class="{thres.color ? thres.color : ''}">{dispVal}{unit}</div>
            </div>
            <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
                <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
            </div>
        </div>
    {:else}
        <div class="bg-white/5 p-1.5 squircle-xs flex flex-col items-center">
            <div class="text-xs leading-tight">
                <span class="font-medium">{label}</span>: <span class="{thres.color ? thres.color : ''}">{dispVal}{unit}</span>
            </div>
            <div class="text-xs text-muted-foreground flex flex-row items-center gap-1">
                <span class="text-2xs">{thres.emoji}</span><span>{thres.label}</span>
            </div>
        </div>
    {/if}
{/snippet}

{#if isLoading}
    <Card.Root class="h-full">
        <Card.Header class="flex flex-row items-center gap-3 mb-4">
            <CircularStatusIndicator loading />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">Loading outdoor weather...</p>
        </Card.Header>
    </Card.Root>
{:else if currentData}
    <Card.Root class="h-full max-w-100">
        <Card.Header class="flex flex-row items-center gap-3">
            <CircularStatusIndicator green />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">Outdoors</p>
        </Card.Header>

        <Card.Content class="flex flex-col items-center gap-2 h-full">
            <p class="m-0 -mb-1 text-xs w-full text-muted-foreground">Current Conditions</p>
            <div class="flex flex-row gap-2 w-full">
                <div class="bg-white/5 squircle-xs flex flex-col items-center justify-center w-32 h-auto gap-1">
                    <span class="text-6xl">{currentConditions?.emoji}</span>
                    <p class="text-sm">{currentConditions?.desc}</p>
                </div>

                <div class="flex-1 gap-2 grid grid-cols-2">
                    {@render metric("Temperature", currentData?.outdoor.temp * (9 / 5) + 32, "ºF", OUTDOOR_TEMP_THRESHOLDS)}
                    {@render metric("Humidity", currentData?.outdoor.hum, "%", OUTDOOR_HUMIDITY_THRESHOLDS)}
                    {@render metric("Pressure", currentData?.outdoor.pressure * 0.02953, " inHg", OUTDOOR_PRESSURE_THRESHOLDS, 2, currentData?.outdoor.pressure)}
                    {@render metric("Dew Point", currentData?.outdoor.dew_point * (9 / 5) + 32, "ºF", OUTDOOR_DEW_POINT_THRESHOLDS)}
                </div>
            </div>

            <p class="m-0 mt-2 -mb-1 text-xs w-full text-muted-foreground">Internal Metrics</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                {@render metric("Internal Temp", currentData?.outdoor.internal_temp * (9 / 5) + 32, "ºF", ESP32_INTERNAL_TEMPERATURE, 0, undefined, true)}
                {@render metric("Internal Humidity", currentData?.outdoor.internal_hum, "%", ESP32_INTERNAL_HUMIDITY, 0, undefined, true)}
                <!-- {@render metric("ESP32 Temp", currentData?.outdoor.esp32_temp, "ºC", ESP32_TEMP_THRESHOLDS, 0, undefined, true)} -->
                {@render metric("ESP32 Voltage", currentData?.outdoor.esp32_voltage, "V", ESP32_VOLT_THRESHOLDS, 2, undefined, true)}
                {@render metric("Connection", currentData?.outdoor.signal_strength, " dBm", ESP32_WIFI_THRESHOLDS, 0, undefined, true)}
            </div>

            <Card.Footer class="h-full flex flex-col justify-end">
                <p class="m-0 mt-2 -mb-2 text-xs w-full">Last updated: <span class="font-semibold">{formatDate(currentData?.outdoor.time)}</span></p>
            </Card.Footer>
        </Card.Content>
    </Card.Root>
{:else}
    <Card.Root class="h-full ring-destructive gap-0">
        <Card.Header class="flex flex-row items-center gap-3 mb-4">
            <CircularStatusIndicator error />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">Error loading outdoor weather</p>
        </Card.Header>
        <Card.Content>
            <div class="italic text-sm text-muted-foreground">Please try again later.</div>
        </Card.Content>
    </Card.Root>
{/if}
