<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
    import CardHeader from '$lib/components/Card/CardHeader.svelte';
    import StatusText from '$lib/components/Card/Utilities/StatusText.svelte';

    let pacificTime = $state("loading...");
    let pacificTimeTimezone = "America/Los_Angeles"
    let pacificTimeEmoji = $state("");

    let easternTime = $state("loading...");
    let easternTimeTimezone = "America/New_York"
    let easternTimeEmoji = $state("");

    let utcTime: string = $state("loading...");
    let utcTimeEmoji: string = $state("");

    let centralEuropeanTime = $state("loading...");
    let centralEuropeanTimeTimezone = "Europe/Berlin"
    let centralEuropeanTimeEmoji = $state("");

    let easternEuropeanTime = $state("loading...");
    let easternEuropeanTimeTimezone = "Europe/Helsinki"
    let easternEuropeanTimeEmoji = $state("");

    let swatchTime: string = $state('000.00');

    function getTimeEmoji(timeStr: string) {
        const morning = '🌅'
        const afternoon = '⛅'
        const night = '🌙'
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        if (hours >= 5 && hours < 11) {
            return morning;  // 5:00-10:59
        } else if (hours >= 11 && hours < 18) {
            return afternoon; // 11:00-17:59
        } else {
            return night; // 18:00-4:59
        }
    }

    function getTimeAndEmoji(timezone: string): [string, string] {
        const now = new Date();

        const time = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(now);
        const emoji = getTimeEmoji(time);

        return [time, emoji];
    }

    function updateTimes() {
        [pacificTime, pacificTimeEmoji] = getTimeAndEmoji(pacificTimeTimezone);
        [easternTime, easternTimeEmoji] = getTimeAndEmoji(easternTimeTimezone);
        [utcTime, utcTimeEmoji] = getTimeAndEmoji("UTC");
        [centralEuropeanTime, centralEuropeanTimeEmoji] = getTimeAndEmoji(centralEuropeanTimeTimezone);
        [easternEuropeanTime, easternEuropeanTimeEmoji] = getTimeAndEmoji(easternEuropeanTimeTimezone);
    }

    function updateSwatchTime() {
        const date = new Date();
        const hours = (date.getUTCHours() + 1) % 24;
        const beats = (((hours * 60 + date.getUTCMinutes()) * 60 + date.getUTCSeconds()) * 1000 + date.getUTCMilliseconds()) / 86400;

        swatchTime = '@' + beats.toFixed(2);
    }

    onMount(() => {
        updateTimes();
        updateSwatchTime();
        const tInterval = setInterval(updateTimes, 60 * 1000);
        const sInterval = setInterval(updateSwatchTime, 864);
        return () => {
            clearInterval(tInterval);
            clearInterval(sInterval);
        };
    });
</script>

<Card height_100percent>
    <CardHeader inlineStyles="margin-bottom: 0.35rem;">
        <StatusText inlineStyles="text-transform: none; font-size: 1.1rem;">{pacificTimeTimezone} (PST/PDT)</StatusText>
    </CardHeader>
    <CardContent inlineStyles="flex-direction: column;">
        <h3 class="time">{pacificTime}{pacificTime == 'loading...' ? '' : ' ' + pacificTimeEmoji}</h3>
    </CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.35rem; margin-top: 1.5rem;">
        <StatusText inlineStyles="text-transform: none; font-size: 1.1rem;">{easternTimeTimezone} (EST/EDT)</StatusText>
    </CardHeader>
    <CardContent inlineStyles="flex-direction: column;">
        <h3 class="time">{easternTime}{easternTime == 'loading...' ? '' : ' ' + easternTimeEmoji}</h3>
    </CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.35rem; margin-top: 1.5rem;">
        <StatusText inlineStyles="text-transform: none; font-size: 1.1rem;">UTC Time</StatusText>
    </CardHeader>
    <CardContent inlineStyles="flex-direction: column;">
        <h3 class="time">{utcTime}{utcTime == 'loading...' ? '' : ' ' + utcTimeEmoji}</h3>
    </CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.35rem; margin-top: 1.5rem;">
        <StatusText inlineStyles="text-transform: none; font-size: 1.1rem;">{centralEuropeanTimeTimezone} (CET/CEST)</StatusText>
    </CardHeader>
    <CardContent inlineStyles="flex-direction: column;">
        <h3 class="time">{centralEuropeanTime}{centralEuropeanTime == 'loading...' ? '' : ' ' + centralEuropeanTimeEmoji}</h3>
    </CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.35rem; margin-top: 1.5rem;">
        <StatusText inlineStyles="text-transform: none; font-size: 1.1rem;">{easternEuropeanTimeTimezone} (EET/EEST)</StatusText>
    </CardHeader>
    <CardContent inlineStyles="flex-direction: column;">
        <h3 class="time">{easternEuropeanTime}{easternEuropeanTime == 'loading...' ? '' : ' ' + easternEuropeanTimeEmoji}</h3>
    </CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.35rem; margin-top: 1.5rem;">
        <StatusText inlineStyles="text-transform: none; font-size: 1.1rem;">Swatch Internet Time</StatusText>
    </CardHeader>
    <CardContent inlineStyles="flex-direction: column;">
        <h3 class="time">{swatchTime}</h3>
    </CardContent>
</Card>

<style>
    .time {
        margin-block: 0;
        font-weight: 600;
        font-size: 1.5rem;
    }
</style>
