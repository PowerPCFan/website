<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
    import CardHeader from '$lib/components/Card/CardHeader.svelte';
    import StatusText from '$lib/components/Card/Utilities/StatusText.svelte';

    let time = "loading...";
    let timezone = "America/New_York"
    let am = true;

    function updateTime() {
        const now = new Date();
        time = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true // 12 hour time my beloved
        }).format(now);

        am = time.toLowerCase().includes("am");
    }

    onMount(() => {
        updateTime();
        const interval = setInterval(updateTime, 60 * 1000);
        return () => clearInterval(interval);
    });
</script>

<Card>
    <CardHeader>
        <StatusText>Timezone: {timezone}</StatusText>
    </CardHeader>
    <CardContent>
        <h2 class="time">{time} {time === 'loading...' ? '' : (am ? '⛅' : '🌙')}</h2>
    </CardContent>
</Card>

<style>
    .time {
        margin-block: 0;
        font-weight: 600;
    }
</style>