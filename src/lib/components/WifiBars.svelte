<script lang="ts">
    import { getThresholdFromValue, ESP32_WIFI_THRESHOLDS } from "$lib/utils/sensors.js";
    import type { Thresholds } from "$lib/utils/sensors.js";

    type Props = {
        rssi: number;
        thresholds?: Thresholds;
        showValue?: boolean;
        unit?: string;
        class?: string;
    };

    let {
        rssi,
        thresholds = ESP32_WIFI_THRESHOLDS,
        showValue = true,
        unit = "dBm",
        class: className = "",
    }: Props = $props();

    const thres = $derived(getThresholdFromValue(thresholds, rssi));
    const barsCount = $derived(
        rssi >= -50 ? 4 : rssi >= -60 ? 3 : rssi >= -75 ? 2 : rssi >= -85 ? 1 : 0
    );
</script>

<div class="h-20 flex flex-col items-center justify-center gap-1.5 {thres.color} {className}">
    <div class="flex items-end gap-1.5 h-8">
        {#each [8, 16, 24, 32] as height, i}
            <div
                class="w-2 rounded-full transition-all duration-300 {i < barsCount ? 'bg-current' : 'bg-white/15'}"
                style="height: {height}px;"
            ></div>
        {/each}
    </div>
    {#if showValue}
        <div class="font-semibold leading-none tabular-nums text-base">
            {rssi} <span class="text-xs font-normal text-muted-foreground">{unit}</span>
        </div>
    {/if}
</div>
