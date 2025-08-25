<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';

    let pacificTime: string = $state("loading...");
    let pacificTimeTimezone: string = "America/Los_Angeles"
    let pacificTimeShorthand: string = $state("Unknown")
    let pacificTimeEmoji: string = $state("");

    let easternTime: string = $state("loading...");
    let easternTimeTimezone: string = "America/New_York"
    let easternTimeShorthand: string = $state("Unknown")
    let easternTimeEmoji: string = $state("");

    let utcTime: string = $state("loading...");
    let utcTimeTimezone: string = "UTC"
    let utcTimeShorthand: string = $state("Unknown")
    let utcTimeEmoji: string = $state("");

    let centralEuropeanTime: string = $state("loading...");
    let centralEuropeanTimeTimezone: string = "Europe/Berlin"
    let centralEuropeanTimeShorthand: string = $state("Unknown")
    let centralEuropeanTimeEmoji: string = $state("");

    let easternEuropeanTime: string = $state("loading...");
    let easternEuropeanTimeTimezone: string = "Europe/Helsinki"
    let easternEuropeanTimeShorthand: string = $state("Unknown")
    let easternEuropeanTimeEmoji: string = $state("");

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

    function getShorthand(timezone: string): string {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'short'
        });

        const parts = formatter.formatToParts(now);
        const tzPart = parts.find(part => part.type === 'timeZoneName');

        return tzPart ? tzPart.value : '';
    }

    function getTimeAndEmojiAndShorthand(timezone: string): [string, string, string] {
        const time = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(new Date());

        return [time, getTimeEmoji(time), getShorthand(timezone)];
    }

    function updateTimes() {
        [pacificTime, pacificTimeEmoji, pacificTimeShorthand] = getTimeAndEmojiAndShorthand(pacificTimeTimezone);
        [easternTime, easternTimeEmoji, easternTimeShorthand] = getTimeAndEmojiAndShorthand(easternTimeTimezone);
        [utcTime, utcTimeEmoji, utcTimeShorthand] = getTimeAndEmojiAndShorthand(utcTimeTimezone);
        [centralEuropeanTime, centralEuropeanTimeEmoji, centralEuropeanTimeShorthand] = getTimeAndEmojiAndShorthand(centralEuropeanTimeTimezone);
        [easternEuropeanTime, easternEuropeanTimeEmoji, easternEuropeanTimeShorthand] = getTimeAndEmojiAndShorthand(easternEuropeanTimeTimezone);
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
    <div class="times-center">
    <div class="times-grid">
        <!-- the heading semantics are absolutely horrible but honestly i dont care -->
        <div class="time-cell">
            <h3 class="time-heading">{pacificTimeShorthand}</h3>
            <h4 class="time-iana-name">{pacificTimeTimezone}</h4>
            <h3 class="time-text">{pacificTime}</h3>
        </div>
        <div class="time-cell">
            <h3 class="time-heading">{easternTimeShorthand}</h3>
            <h4 class="time-iana-name">{easternTimeTimezone}</h4>
            <h3 class="time-text">{easternTime}</h3>
        </div>
        <div class="time-cell">
            <h3 class="time-heading">{utcTimeShorthand}</h3>
            <h4 class="time-iana-name">{utcTimeTimezone}</h4>
            <h3 class="time-text">{utcTime}</h3>
        </div>
        <div class="time-cell">
            <h3 class="time-heading">{centralEuropeanTimeShorthand}</h3>
            <h4 class="time-iana-name">{centralEuropeanTimeTimezone}</h4>
            <h3 class="time-text">{centralEuropeanTime}</h3>
        </div>
        <div class="time-cell">
            <h3 class="time-heading">{easternEuropeanTimeShorthand}</h3>
            <h4 class="time-iana-name">{easternEuropeanTimeTimezone}</h4>
            <h3 class="time-text">{easternEuropeanTime}</h3>
        </div>
        <div class="time-cell">
            <h3 class="time-heading">Internet Time</h3>
            <h4 class="time-iana-name">(Swatch Time)</h4>
            <h3 class="time-text">{swatchTime}</h3>
        </div>
    </div>
    </div>
</Card>

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
