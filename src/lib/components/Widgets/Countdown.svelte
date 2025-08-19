<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
    import CardHeader from '$lib/components/Card/CardHeader.svelte';
    import StatusText from '$lib/components/Card/Utilities/StatusText.svelte';

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

    // thanks for this function chatgpt
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


<Card>
    <CardHeader inlineStyles="margin-bottom: 0.25rem;">
        <StatusText>Countdown to Y2K38</StatusText>
    </CardHeader>
    <CardContent>
        <h3 class="countdown">{y2k38countdown}</h3>
    </CardContent>
    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText>Countdown to NTP date rollover</StatusText>
    </CardHeader>
    <CardContent>
        <h3 class="countdown">{ntpCountdown}</h3>
    </CardContent>
    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText>Countdown to Y2106</StatusText>
    </CardHeader>
    <CardContent>
        <h3 class="countdown">{y2106countdown}</h3>
    </CardContent>
    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText>Countdown to FAT filesystem date rollover</StatusText>
    </CardHeader>
    <CardContent>
        <h3 class="countdown">{fatCountdown}</h3>
    </CardContent>
</Card>


<style>
    .countdown {
        margin-block: 0;
        font-weight: 600;
        text-align: left;
    }
</style>
