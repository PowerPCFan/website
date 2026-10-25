<script lang="ts">
    import { onMount } from 'svelte';
    import * as Card from "$lib/components/ui/card/index.js";

    let pacificTime = $state("loading...");
    let pacificShorthand = $state("Unknown");
    let pacificEmoji = $state("");

    let easternTime = $state("loading...");
    let easternShorthand = $state("Unknown");
    let easternEmoji = $state("");

    let utcTime = $state("loading...");
    let utcShorthand = $state("Unknown");
    let utcEmoji = $state("");

    let centralEuropeanTime = $state("loading...");
    let centralEuropeanShorthand = $state("Unknown");
    let centralEuropeanEmoji = $state("");

    let easternEuropeanTime = $state("loading...");
    let easternEuropeanShorthand = $state("Unknown");
    let easternEuropeanEmoji = $state("");

    let indiaTime = $state("loading...");
    let indiaShorthand = $state("Unknown");
    let indiaEmoji = $state("");

    let chinaTime = $state("loading...");
    let chinaShorthand = $state("Unknown");
    let chinaEmoji = $state("");

    let swatchTime = $state('000.00');


    function getTimeEmoji(timeStr: string) {
        const [time, modifier] = timeStr.split(' ');
        let [hours] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        if (hours >= 5 && hours < 11) return '🌅';
        if (hours >= 11 && hours < 18) return '⛅';
        return '🌙';
    }

    function isDst(timezone: string): boolean {
        const now = new Date();
        const getOffset = (date: Date): number => {
            const utc = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
            const target = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
            return (utc.getTime() - target.getTime()) / 60000;
        };
        const currentOffset = getOffset(now);
        const januaryOffset = getOffset(new Date(now.getFullYear(), 0, 1));
        return currentOffset !== januaryOffset;
    }

    interface TimeZones {
        name: string;
        time: () => string;
        shorthand: () => string;
        emoji: () => string;
        standard: string;
        daylight: string;
    }

    const timeZones: TimeZones[] = [
        {
            name: "America/Los_Angeles",
            time: () => pacificTime,
            shorthand: () => pacificShorthand,
            emoji: () => pacificEmoji,
            standard: "PST",
            daylight: "PDT"
        },
        {
            name: "America/New_York",
            time: () => easternTime,
            shorthand: () => easternShorthand,
            emoji: () => easternEmoji,
            standard: "EST",
            daylight: "EDT"
        },
        {
            name: "UTC",
            time: () => utcTime,
            shorthand: () => utcShorthand,
            emoji: () => utcEmoji,
            standard: "UTC",
            daylight: "UTC"
        },
        {
            name: "Europe/Berlin",
            time: () => centralEuropeanTime,
            shorthand: () => centralEuropeanShorthand,
            emoji: () => centralEuropeanEmoji,
            standard: "CET",
            daylight: "CEST"
        },
        {
            name: "Europe/Helsinki",
            time: () => easternEuropeanTime,
            shorthand: () => easternEuropeanShorthand,
            emoji: () => easternEuropeanEmoji,
            standard: "EET",
            daylight: "EEST"
        },
        {
            name: "Asia/Kolkata",
            time: () => indiaTime,
            shorthand: () => indiaShorthand,
            emoji: () => indiaEmoji,
            standard: "IST",
            daylight: "IST"
        },
        {
            name: "Asia/Shanghai",
            time: () => chinaTime,
            shorthand: () => chinaShorthand,
            emoji: () => chinaEmoji,
            standard: "CST",
            daylight: "CST"
        }
    ];

    function getTimeAndEmojiAndShorthand(zone: typeof timeZones[number]) {
        const time = new Intl.DateTimeFormat("en-US", {
            timeZone: zone.name,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(new Date());

        const dst = isDst(zone.name);
        const sh = dst ? zone.daylight : zone.standard;

        return [time, getTimeEmoji(time), sh];
    }

    function updateTimes() {
        [pacificTime, pacificEmoji, pacificShorthand] = getTimeAndEmojiAndShorthand(timeZones[0]);
        [easternTime, easternEmoji, easternShorthand] = getTimeAndEmojiAndShorthand(timeZones[1]);
        [utcTime, utcEmoji, utcShorthand] = getTimeAndEmojiAndShorthand(timeZones[2]);
        [centralEuropeanTime, centralEuropeanEmoji, centralEuropeanShorthand] = getTimeAndEmojiAndShorthand(timeZones[3]);
        [easternEuropeanTime, easternEuropeanEmoji, easternEuropeanShorthand] = getTimeAndEmojiAndShorthand(timeZones[4]);
        [indiaTime, indiaEmoji, indiaShorthand] = getTimeAndEmojiAndShorthand(timeZones[5]);
        [chinaTime, chinaEmoji, chinaShorthand] = getTimeAndEmojiAndShorthand(timeZones[6]);
    }

    function updateSwatchTime() {
        const date = new Date();

        let hours = (date.getUTCHours() + 1) % 24;
        let minutes = date.getUTCMinutes();
        let seconds = date.getUTCSeconds();
        let milliseconds = date.getUTCMilliseconds();
        let timeInMilliseconds = ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
        let beats = timeInMilliseconds / 86400;

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

<Card.Root class="h-full max-w-100">
    <div class="times-center">
        <div class="times-grid">
            {#each timeZones as zone}
                <div class="time-cell">
                    <h3 class="time-heading">{zone.shorthand()}</h3>
                    <h4 class="time-iana-name">{zone.name}</h4>
                    <h3 class="time-text">{zone.time()} {zone.emoji()}</h3>
                </div>
            {/each}
            <div class="time-cell">
                <h3 class="time-heading">Internet Time</h3>
                <h4 class="time-iana-name">(Swatch Time)</h4>
                <h3 class="time-text">{swatchTime}</h3>
            </div>
        </div>
    </div>
</Card.Root>


<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .times-center {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .times-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;

        .time-cell {
            width: 100%;
            height: 100%;
            margin: 0;

            * {
                width: 100%;
                text-align: center;
                margin: 0;
            }

            .time-heading {
                font-size: 1.1rem;
                font-weight: 600;
                color: g.$border;
                letter-spacing: 0.5px;
            }

            .time-iana-name {
                font-size: 0.8rem;
                color: g.$border;
            }

            .time-text {
                margin-block: 0.3rem 0;
                font-weight: 600;
                font-size: 1.5rem;
            }
        }
    }
</style>
