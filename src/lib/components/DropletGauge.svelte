<script lang="ts">
    import { useId } from "bits-ui";

    let {
        value,
        color = "text-blue-500",
        id,
        class: className = "",
    }: {
        value: number;
        color?: string;
        id?: string;
        class?: string;
    } = $props();

    const defaultId = useId();
    const clipId = $derived(id ?? defaultId);
    const clamped = $derived(Math.max(0, Math.min(100, value ?? 0)));
    const waterY = $derived(114 - (clamped / 100) * 108);

    const wavePath = $derived.by(() => {
        const a = 1.8;
        const yt = waterY + a;
        const yc = waterY - a;
        return `M 0,${yt} C 3.6,${yt} 6.4,${yc} 10,${yc} C 13.6,${yc} 16.4,${yt} 20,${yt} C 23.6,${yt} 26.4,${yc} 30,${yc} C 33.6,${yc} 36.4,${yt} 40,${yt} C 43.6,${yt} 46.4,${yc} 50,${yc} C 53.6,${yc} 56.4,${yt} 60,${yt} C 63.6,${yt} 66.4,${yc} 70,${yc} C 73.6,${yc} 76.4,${yt} 80,${yt} C 83.6,${yt} 86.4,${yc} 90,${yc} C 93.6,${yc} 96.4,${yt} 100,${yt} L 100,120 L 0,120 Z`;
    });
</script>

<div class="relative shrink-0 flex items-center justify-center size-20 {className}">
    <svg viewBox="0 0 100 120" class="w-16 h-20 overflow-visible {color}">
        <defs>
            <clipPath id={clipId}>
                <path d="M 50,6 C 50,6 16,52 16,80 A 34,34 0 0,0 84,80 C 84,52 50,6 50,6 Z" />
            </clipPath>
            <linearGradient id="{clipId}-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="currentColor" stop-opacity="0.85" />
                <stop offset="100%" stop-color="currentColor" stop-opacity="1" />
            </linearGradient>
        </defs>

        <path
            d="M 50,6 C 50,6 16,52 16,80 A 34,34 0 0,0 84,80 C 84,52 50,6 50,6 Z"
            class="fill-gray-800/90 stroke-white/10"
            stroke-width="1.5"
        />

        <g clip-path="url(#{clipId})">
            <path
                d={wavePath}
                fill="url(#{clipId}-grad)"
            />
        </g>

        <path
            d="M 50,6 C 50,6 16,52 16,80 A 34,34 0 0,0 84,80 C 84,52 50,6 50,6 Z"
            fill="none"
            class="stroke-white/15"
            stroke-width="1.5"
        />
    </svg>

    <div class="absolute inset-0 flex flex-col items-center justify-center pt-2.5 pointer-events-none">
        <div class="font-bold leading-none tabular-nums {(value ?? 0).toString().length > 2 ? 'text-sm' : 'text-base'} text-white">
            {Math.round(value ?? 0)}
        </div>
        <div class="text-[10px] font-semibold text-white/90">
            %
        </div>
    </div>
</div>
