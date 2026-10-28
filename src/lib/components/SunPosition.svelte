<script lang="ts">
    type DateInput = Date | string | number;
    type ISODate = string;

    let {
        sunrise,
        sunset,
        dataTs,
        loc,
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
        now,
        class: className = ''
    }: {
        sunrise: DateInput;
        sunset: DateInput;
        dataTs: ISODate;
        loc: string;
        timeZone?: string;
        now?: DateInput;
        class?: string;
    } = $props();

    let tick = $state(Date.now());

    $effect(() => {
        if (now !== undefined) return;
        const id = setInterval(() => (tick = Date.now()), 30_000);
        return () => clearInterval(id);
    });

    const riseMs = $derived(new Date(sunrise).getTime());
    const setMs = $derived(new Date(sunset).getTime());
    const nowMs = $derived(now !== undefined ? new Date(now).getTime() : tick);

    const raw = $derived((nowMs - riseMs) / (setMs - riseMs));
    const isDay = $derived(raw >= 0 && raw <= 1);
    const progress = $derived(Math.min(1, Math.max(0, raw)));

    const W = 200;
    const X0 = 10;
    const X1 = 190;
    const arcHeight = 32;
    const spaceAboveArc = 9;
    const spaceBelowHorizon = 4;
    const CY = arcHeight + spaceAboveArc;
    const H = CY + spaceBelowHorizon;

    const half = (X1 - X0) / 2;
    const R = (half * half + arcHeight * arcHeight) / (2 * arcHeight);
    const theta = Math.asin(half / R);
    const centerY = CY - arcHeight + R;

    const arcPath = `M ${X0} ${CY} A ${R.toFixed(2)} ${R.toFixed(2)} 0 0 1 ${X1} ${CY}`;

    const pos = $derived.by(() => {
        const phi = -theta + 2 * theta * progress;
        return {
            x: 100 + R * Math.sin(phi),
            y: centerY - R * Math.cos(phi),
        };
    });

    const timeFmt = $derived(
        new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', timeZone })
    );

    function fmt(v: number) {
        return timeFmt.format(new Date(v));
    }

    function formatDateForDisplay(date: string): string {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        }).format(new Date(`${date}T00:00:00Z`));
    }
</script>

<div class={`w-full max-w-xs ${className}`}>
    <div class="text-xs text-center w-full">{formatDateForDisplay(dataTs)} • Schedule for {loc}</div>
    <div class="relative w-full" style={`aspect-ratio: ${W} / ${H}`}>
        <svg viewBox={`0 0 ${W} ${H}`} class="absolute inset-0 size-full overflow-visible" aria-hidden="true">
            <line x1="0" y1={CY} x2={W} y2={CY} class="stroke-foreground/40" stroke-width="0.75" />
            <path
                d={arcPath}
                fill="none"
                class="stroke-foreground/40"
                stroke-width="1"
                stroke-dasharray="2 6"
                stroke-linecap="round"
            />
            {#if isDay}
                <path
                    d={arcPath}
                    fill="none"
                    class="stroke-amber-300"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    pathLength="1"
                    stroke-dasharray="{progress} 1"
                />
            {/if}
        </svg>

        {#if isDay}
            <div
                class="absolute flex size-6.5 p-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-300"
                style={`left: ${(pos.x / W) * 100}%; top: ${(pos.y / H) * 100}%`}
                role="img"
                aria-label='Current sun position'
            >
                <i class="material-symbols-outlined text-lg text-background">sunny</i>
            </div>
        {/if}
    </div>

    <div class="mt-1 grid grid-cols-3 gap-5">
        <div>
            <div class="text-xs flex items-center justify-start w-full gap-1">
                <i class="material-symbols-outlined text-sm text-orange-400">partly_cloudy_day</i> Sunrise
            </div>
            <div class="text-sm font-medium tabular-nums text-orange-400">{fmt(riseMs)}</div>
        </div>
        {#if !isDay}
            <div class="text-center italic text-muted-foreground leading-tight">
                <div class="text-xs">Nighttime</div>
                <div class="text-[0.6rem]">Sun below horizon</div>
            </div>
        {:else}
            <div></div>
        {/if}
        <div class="text-right">
            <div class="text-xs flex items-center justify-end w-full gap-1">
                Sunset <i class="material-symbols-outlined text-sm text-purple-400">moon_stars</i>
            </div>
            <div class="text-sm font-medium tabular-nums text-purple-400">{fmt(setMs)}</div>
        </div>
    </div>
</div>