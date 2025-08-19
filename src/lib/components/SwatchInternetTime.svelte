<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
    import CardHeader from '$lib/components/Card/CardHeader.svelte';
    import StatusText from '$lib/components/Card/Utilities/StatusText.svelte';

    let swatchTime: string = $state('000.00');

    function updateTime() {
        swatchTime = getCurrentSwatchTime();
    }

    function getCurrentSwatchTime(showDecimals = true): string {
        const currentTime = new Date();
        return getSwatchTimeAt(currentTime, showDecimals);
    }

    function getSwatchTimeAt(date: Date, showDecimals = true): string {
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let seconds = date.getUTCSeconds();
        let milliseconds = date.getUTCMilliseconds();

        hours = (hours + 1) % 24;
        let timeInMilliseconds = ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
        let beats = timeInMilliseconds / 86400;

        return showDecimals ? beats.toFixed(2) : Math.floor(beats).toString();
    }

    onMount(() => {
        updateTime();
        const interval = setInterval(updateTime, 864);
        return () => clearInterval(interval);
    });
</script>


<Card>
    <CardHeader>
        <StatusText>
            <a href="https://wiki.melonland.net/swatch_time" target="_blank">swatch internet time</a>
        </StatusText>
    </CardHeader>
    <CardContent>
        <h2 class="time">&#64;{swatchTime}</h2>
    </CardContent>
</Card>


<style>
    .time {
        margin-block: 0;
        font-weight: 600;
    }
</style>