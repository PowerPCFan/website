<script lang="ts">
    import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card/index.js';

    let y2k38countdown: string = $state('');
    let ntpCountdown: string = $state('');
    let y2106countdown: string = $state('');
    let fatCountdown: string = $state('');

    function updateCountdowns() {
        const now = Math.floor(Date.now() / 1000);
        y2k38countdown = formatDiff(2147483647 - now);
        ntpCountdown = formatDiff(2085978496 - now);
        y2106countdown = formatDiff(4294967295 - now);
        fatCountdown = formatDiff(Math.floor(new Date("2108-01-01T00:00:00Z").getTime() / 1000) - now);
    }

    function formatDiff(diff: number): string {
        const units = [
            ["year", 365 * 24 * 60 * 60],
            ["day", 24 * 60 * 60],
            ["hour", 60 * 60],
            ["minute", 60],
            ["second", 1],
        ] as const;

        const parts: string[] = [];

        for (const [name, seconds] of units) {
            const value = Math.floor(diff / seconds);
            parts.push(`${value} ${name}${value !== 1 ? "s" : ""}`);
            diff %= seconds;
        }

        return parts.join(" ");
    }

    onMount(() => {
        updateCountdowns();
        const interval = setInterval(updateCountdowns, 1000);
        return () => clearInterval(interval);
    });
</script>


<Card.Root class="h-full max-w-100 gap-2">
    <Card.Content>
        <p class="m-0 text-sm text-muted-foreground font-semibold">Countdown to NTP date rollover</p>
        <h4 class="my-0 font-semibold text-left">{ntpCountdown}</h4>
    </Card.Content>
    <Card.Content>
        <p class="m-0 text-sm text-muted-foreground font-semibold">Countdown to Y2K38</p>
        <h4 class="my-0 font-semibold text-left">{y2k38countdown}</h4>
    </Card.Content>
    <Card.Content>
        <p class="m-0 text-sm text-muted-foreground font-semibold">Countdown to Y2106</p>
        <h4 class="my-0 font-semibold text-left">{y2106countdown}</h4>
    </Card.Content>
    <Card.Content>
        <p class="m-0 text-sm text-muted-foreground font-semibold">Countdown to FAT filesystem date rollover</p>
        <h4 class="my-0 font-semibold text-left">{fatCountdown}</h4>
    </Card.Content>
</Card.Root>
