<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
    import CardHeader from '$lib/components/Card/CardHeader.svelte';
    import StatusText from '$lib/components/Card/Utilities/StatusText.svelte';

    let countdown: string = $state('');

    function updateCountdown() {
        countdown = formatDiff(2147483647 - Math.floor(Date.now() / 1000));
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
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    });
</script>


<Card>
    <CardHeader>
        <StatusText>
            Countdown to <a href="https://en.wikipedia.org/wiki/Year_2038_problem" target="_blank">Y2K38</a>
        </StatusText>
    </CardHeader>
    <CardContent>
        <h2 class="countdown">{countdown}</h2>
    </CardContent>
</Card>


<style>
    .countdown {
        margin-block: 0;
        font-weight: 600;
    }
</style>
