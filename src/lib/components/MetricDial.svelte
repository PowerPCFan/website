<script lang="ts">
    import { getThresholdFromValue } from "$lib/utils/sensors.js";
    import type { Thresholds, Threshold } from "$lib/utils/sensors.js";

    type Props = {
        value: number;
        unit?: string;
        min?: number;
        max?: number;
        thresholds?: Thresholds;
        decimalPlaces?: number;
        sweep?: number;
        gap?: number;
        class?: string;
    };

    let {
        value,
        unit = "",
        min = 0,
        max = 100,
        thresholds,
        decimalPlaces = 0,
        sweep = 270,
        gap = 2,
        class: className = "",
    }: Props = $props();

    function roundTo(num: number, digits: number): number {
        // @ts-expect-error
        return Number(Math.round(num + "e" + digits) + "e-" + digits);
    }

    const activeThreshold = $derived.by((): Threshold => {
        if (!thresholds) return { label: "", emoji: "", color: "text-foreground" };
        return getThresholdFromValue(thresholds, value);
    });

    const activeColor = $derived(activeThreshold.color || "text-foreground");

    const fraction = $derived.by(() => {
        if (max === min) return 0;
        return Math.max(0, Math.min(1, (value - min) / (max - min)));
    });

    const markerAngle = $derived(-sweep / 2 + fraction * sweep);

    type RawBand = {
        fromVal: number;
        toVal: number;
        color: string;
    };

    const bands = $derived.by(() => {
        if (!thresholds) {
            return [{ fromVal: min, toVal: max, color: "text-foreground" }];
        }

        const sorted = Object.entries(thresholds)
            .map(([k, v]) => ({ val: Number(k), color: v.color || "text-foreground" }))
            .sort((a, b) => a.val - b.val);

        if (sorted.length === 0) {
            return [{ fromVal: min, toVal: max, color: "text-foreground" }];
        }

        const rawBands: RawBand[] = [];
        for (let i = 0; i < sorted.length; i++) {
            const color = sorted[i].color;
            const fromVal = i === 0 ? min : Math.max(min, Math.min(max, sorted[i].val));
            const toVal = i < sorted.length - 1 ? Math.max(min, Math.min(max, sorted[i + 1].val)) : max;
            if (toVal > fromVal) {
                rawBands.push({ fromVal, toVal, color });
            }
        }

        return rawBands;
    });

    const renderedBands = $derived.by(() => {
        const range = max - min;
        if (range <= 0) return [];

        return bands.map((b, i) => {
            const s = (b.fromVal - min) / range;
            const e = (b.toVal - min) / range;
            const from = s * sweep + (i === 0 ? 0 : gap / 2);
            const to = e * sweep - (i === bands.length - 1 ? 0 : gap / 2);
            const litTo = Math.max(from, Math.min(to, fraction * sweep));
            return {
                color: b.color,
                from,
                to,
                litTo,
                valid: to > from,
            };
        }).filter((b) => b.valid);
    });

    function arc(from: number, to: number) {
        return `conic-gradient(from ${360 - sweep / 2}deg, transparent 0deg ${from}deg, currentColor ${from}deg ${to}deg, transparent ${to}deg 360deg)`;
    }

    const ringMask = "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px), #000 calc(100% - 0.5px), transparent 100%)";

    const dispVal = $derived(roundTo(value, decimalPlaces));
    const dispValStr = $derived(decimalPlaces > 0 ? dispVal.toFixed(decimalPlaces) : dispVal.toString());
</script>

<div class="relative shrink-0 rounded-full bg-gray-800 size-20 {className}">
    {#each renderedBands as band}
        <div
            class="absolute rounded-full inset-1 opacity-25 {band.color}"
            style="background: {arc(band.from, band.to)}; mask: {ringMask}; -webkit-mask: {ringMask};"
        ></div>
        <div
            class="absolute rounded-full inset-1 {band.color}"
            style="background: {arc(band.from, band.litTo)}; mask: {ringMask}; -webkit-mask: {ringMask};"
        ></div>
    {/each}

    <div
        class="absolute inset-1"
        style="transform: rotate({markerAngle}deg);"
    >
        <div class="mx-auto rounded-full bg-gray-100 ring-2 ring-gray-800 -mt-0.5 h-2.5 w-1"></div>
    </div>

    <div class="absolute inset-0 {unit ? 'top-2' : 'bottom-px'} flex flex-col items-center justify-center">
        <div class="font-semibold leading-none tabular-nums {dispValStr.length >= 4 ? 'text-base' : 'text-xl'} {activeColor}">
            {dispValStr}
        </div>
        {#if unit}
            <div class="font-medium text-gray-400 text-[10px]">{unit}</div>
        {/if}
    </div>
</div>
