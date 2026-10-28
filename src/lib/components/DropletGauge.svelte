<script lang="ts">
    import { useId } from "bits-ui";

    type Props = {
        value: number;
        color?: string;
        id?: string;
        class?: string;
    };

    let {
        value,
        color = "text-blue-500",
        id,
        class: className = "",
    }: Props = $props();

    const defaultId = useId();
    const clipId = $derived(id ?? defaultId);
    const clamped = $derived(Math.max(0, Math.min(100, value)));
    // Total teardrop height in viewBox (0 0 100 120): bottom is 114, top is 6
    const waterY = $derived(114 - (clamped / 100) * 108);
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

        <!-- Droplet glass background track -->
        <path
            d="M 50,6 C 50,6 16,52 16,80 A 34,34 0 0,0 84,80 C 84,52 50,6 50,6 Z"
            class="fill-gray-800/90 stroke-white/10"
            stroke-width="1.5"
        />

        <!-- Water Fill (clipped to droplet shape) -->
        <g clip-path="url(#{clipId})">
            <path
                d="M 0,{waterY} Q 25,{waterY - 2.5} 50,{waterY} T 100,{waterY} L 100,120 L 0,120 Z"
                fill="url(#{clipId}-grad)"
            />
        </g>

        <!-- Outer rim border for glass edge definition -->
        <path
            d="M 50,6 C 50,6 16,52 16,80 A 34,34 0 0,0 84,80 C 84,52 50,6 50,6 Z"
            fill="none"
            class="stroke-white/15"
            stroke-width="1.5"
        />
    </svg>

    <!-- Center numeric readout -->
    <div class="absolute inset-0 flex flex-col items-center justify-center pt-2.5 pointer-events-none">
        <div class="font-bold leading-none tabular-nums text-lg text-white">
            {Math.round(value)}
        </div>
        <div class="text-[10px] font-semibold text-white/90">
            %
        </div>
    </div>
</div>
