<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
    import CardHeader from '$lib/components/Card/CardHeader.svelte';
    import StatusText from '$lib/components/Card/Utilities/StatusText.svelte';

    let localTime = $state("loading...");
    let localTimeTimezone = "America/New_York"
    let localTimeEmoji = $state("");

    let swatchTime: string = $state('000.00');

    let swatchTimeMode = $state(false);

    function toggleMode() {
        swatchTimeMode = !swatchTimeMode;
    }

    function getLocalTimeEmoji(timeStr: string) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        if (hours >= 5 && hours < 11) {
            return '🌅';  // 5:00-10:59
        } else if (hours >= 11 && hours < 18) {
            return '⛅'; // 11:00-17:59
        } else {
            return '🌙'; // 18:00-4:59
        }
    }

    function updateLocalTime() {
        const now = new Date();
        localTime = new Intl.DateTimeFormat("en-US", {
            timeZone: localTimeTimezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true // 12 hour time my beloved
        }).format(now);

        localTimeEmoji = getLocalTimeEmoji(localTime);
    }

    function updateSwatchTime() {
        swatchTime = '@' + getCurrentSwatchTime();
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
        updateLocalTime();
        updateSwatchTime();
        const ltInterval = setInterval(updateLocalTime, 60 * 1000);
        const sInterval = setInterval(updateSwatchTime, 864);
        return () => {
            clearInterval(ltInterval);
            clearInterval(sInterval);
        };
    });
</script>

<Card>
    <CardHeader>
        <StatusText inlineStyles="text-transform: none;">{swatchTimeMode ? 'Swatch Internet Time' : 'Local Time (' + localTimeTimezone + ')'}</StatusText>
    </CardHeader>
    <CardContent inlineStyles="flex-direction: column;">
        <StatusText inlineStyles="text-transform: none; font-style: italic;"><button class="anchor-tag-styles" onclick={toggleMode}>{swatchTimeMode ? 'Switch to Local Time' : 'Switch to Swatch Internet Time'}</button></StatusText>
        <h2 class="time">{swatchTimeMode ? swatchTime : localTime} {swatchTimeMode ? '' : localTimeEmoji}</h2>
    </CardContent>
</Card>

<style>
    .time {
        margin-block: 0;
        font-weight: 600;
    }
</style>
