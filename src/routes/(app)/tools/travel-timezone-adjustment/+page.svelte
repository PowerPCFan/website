<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import Title from '$lib/components/title.svelte';
    import TimezonePicker from '$lib/components/TimezonePicker.svelte';

    type Speed = 'gentle' | 'moderate' | 'fast' | 'custom';
    type ShiftPriority = 'both' | 'wake' | 'bedtime';

    interface PlannerState {
        currentTz: string;
        destinationTz: string;

        sleepTime: string;
        wakeTime: string;

        departureDate: string;

        targetShiftHours: number;
        speed: Speed;
        customShiftPerDay: number;

        priority: ShiftPriority;

        wakeDurationMinutes: number;
    }

    interface ScheduleDay {
        day: number;
        date: string;
        sleep: string;
        wake: string;
        sleepMinutes: number;
        wakeMinutes: number;
        shiftApplied: number;
        totalShift: number;
    }

    const STORAGE_KEY = 'tta-v1';
    const SAVED_KEY = 'tta-saved-v1';

    const defaults: PlannerState = {
        currentTz: 'America/New_York',
        destinationTz: 'Europe/Helsinki',

        sleepTime: '22:00',
        wakeTime: '06:00',

        departureDate: '',

        targetShiftHours: 2,
        speed: 'moderate',
        customShiftPerDay: 1,

        priority: 'both',

        wakeDurationMinutes: 480
    };

    let plState = $state<PlannerState>({ ...defaults });
    let planSaved = $state(false);
    let hydrated = $state(false);

    let step = $state(0);
    let importedFile = $state<HTMLInputElement | null>(null);

    const steps = ['Your schedule', 'Destination', 'Time', 'Shift amount', 'Adjustment style', 'Review'];

    const descs = {
        "gentle": "Best for small time differences or people who struggle with adjusting their sleep/wake times.",
        "moderate": "Good for most people and most time differences. A balance between speed and comfort.",
        "fast": "Best for large time differences or people who want to adjust quickly. Can be uncomfortable, especially when traveling eastward.",
        "custom": "This allows you to set your own shift amount per day."
    }

    /* ---------------------------------------------------------
     * Persistence
     * --------------------------------------------------------- */

    $effect(() => {
        if (!browser || !hydrated) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(plState));
        localStorage.setItem(SAVED_KEY, String(planSaved));
    });

    onMount(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedStatus = localStorage.getItem(SAVED_KEY);
        if (savedStatus === 'true') planSaved = true;

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (parsed && typeof parsed === 'object') {
                    plState = {
                        ...defaults,
                        ...parsed
                    };
                }
            } catch {
                // Ignore corrupt localStorage data.
            }
        }

        hydrated = true;
    });

    /* ---------------------------------------------------------
     * Time helpers
     * --------------------------------------------------------- */

    function timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function minutesToTime(minutes: number): string {
        minutes = ((minutes % 1440) + 1440) % 1440;

        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);

        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    function formatTime(time: string): string {
        const [hours, minutes] = time.split(':').map(Number);

        const suffix = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return `${displayHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
    }

    function getSleepDurationMinutes(): number {
        const s = timeToMinutes(plState.sleepTime);
        const w = timeToMinutes(plState.wakeTime);
        return (w - s + 1440) % 1440;
    }

    function formatDurationLabel(minutes: number): string {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    }

    function setSleepDuration(minutes: number) {
        const s = timeToMinutes(plState.sleepTime);
        const newWake = (s + minutes) % 1440;
        plState.wakeTime = minutesToTime(newWake);
    }

    function isMinuteInArc(m: number, s: number, w: number): boolean {
        if (s === w) return false;
        if (s < w) {
            return m > s && m < w;
        } else {
            return m > s || m < w;
        }
    }

    const dialHours = [
        { hour: 0, label: '12AM' },
        { hour: 2, label: '2' },
        { hour: 4, label: '4' },
        { hour: 6, label: '6AM' },
        { hour: 8, label: '8' },
        { hour: 10, label: '10' },
        { hour: 12, label: '12PM' },
        { hour: 14, label: '2' },
        { hour: 16, label: '4' },
        { hour: 18, label: '6PM' },
        { hour: 20, label: '8' },
        { hour: 22, label: '10' },
    ];

    let svgElement = $state<SVGSVGElement | null>(null);
    let dragMode = $state<'arc' | 'bedtime' | 'wake' | null>(null);
    let dragStartAngle = $state(0);
    let dragStartSleepMinutes = $state(0);
    let dragStartWakeMinutes = $state(0);

    let sleepMinutes = $derived(timeToMinutes(plState.sleepTime));
    let wakeMinutes = $derived(timeToMinutes(plState.wakeTime));
    let sleepDurationMinutes = $derived(getSleepDurationMinutes());

    let sleepAngle = $derived((sleepMinutes / 1440) * 360);
    let wakeAngle = $derived((wakeMinutes / 1440) * 360);
    let arcAngleSpan = $derived((wakeAngle - sleepAngle + 360) % 360 || 359.99);

    let sleepCoords = $derived({
        x: 170 + 124 * Math.sin((sleepAngle * Math.PI) / 180),
        y: 170 - 124 * Math.cos((sleepAngle * Math.PI) / 180)
    });

    let wakeCoords = $derived({
        x: 170 + 124 * Math.sin((wakeAngle * Math.PI) / 180),
        y: 170 - 124 * Math.cos((wakeAngle * Math.PI) / 180)
    });

    let arcPath = $derived(
        `M ${sleepCoords.x} ${sleepCoords.y} A 124 124 0 ${arcAngleSpan > 180 ? 1 : 0} 1 ${wakeCoords.x} ${wakeCoords.y}`
    );

    function getPointerAngle(event: PointerEvent): number {
        if (!svgElement) return 0;
        const rect = svgElement.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
        if (angle < 0) angle += 360;
        return angle;
    }

    function handlePointerDown(mode: 'arc' | 'bedtime' | 'wake', event: PointerEvent) {
        event.preventDefault();
        event.stopPropagation();
        (event.currentTarget as Element).setPointerCapture(event.pointerId);

        dragMode = mode;
        dragStartAngle = getPointerAngle(event);
        dragStartSleepMinutes = timeToMinutes(plState.sleepTime);
        dragStartWakeMinutes = timeToMinutes(plState.wakeTime);
    }

    function handlePointerMove(event: PointerEvent) {
        if (!dragMode) return;
        event.preventDefault();

        const currentAngle = getPointerAngle(event);
        const pointerMinutes = (Math.round(((currentAngle / 360) * 1440) / 5) * 5) % 1440;

        if (dragMode === 'arc') {
            let deltaAngle = currentAngle - dragStartAngle;
            if (deltaAngle > 180) deltaAngle -= 360;
            if (deltaAngle < -180) deltaAngle += 360;

            const deltaMinutes = Math.round(((deltaAngle / 360) * 1440) / 5) * 5;
            const newSleep = ((dragStartSleepMinutes + deltaMinutes) % 1440 + 1440) % 1440;
            const newWake = ((dragStartWakeMinutes + deltaMinutes) % 1440 + 1440) % 1440;

            plState.sleepTime = minutesToTime(newSleep);
            plState.wakeTime = minutesToTime(newWake);
        } else if (dragMode === 'bedtime') {
            plState.sleepTime = minutesToTime(pointerMinutes);
        } else if (dragMode === 'wake') {
            plState.wakeTime = minutesToTime(pointerMinutes);
        }
    }

    function handlePointerUp(event: PointerEvent) {
        if (dragMode) {
            try {
                (event.currentTarget as Element).releasePointerCapture(event.pointerId);
            } catch {}
            dragMode = null;
        }
    }

    function formatDate(dateString: string): string {
        if (!dateString) return '';

        const date = new Date(`${dateString}T12:00:00`);

        return new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    function isToday(dateString: string): boolean {
        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        return dateString === todayString;
    }

    function getScheduleColor(day: number, totalDays: number): string {
        const start = [61, 116, 255]; // starting blue
        const end = [59, 227, 119]; // destination green
        const progress = totalDays <= 1 ? 1 : day / (totalDays - 1);
        const rgb = start.map((channel, index) => Math.round(channel + (end[index] - channel) * progress));
        return `rgb(${rgb.join(', ')})`;
    }

    function addDays(dateString: string, days: number): string {
        const date = new Date(`${dateString}T12:00:00`);
        date.setDate(date.getDate() + days);

        return date.toISOString().slice(0, 10);
    }

    /* ---------------------------------------------------------
     * Timezone helpers
     * --------------------------------------------------------- */

    function getTimezoneOffsetMinutes(timeZone: string, dateString: string): number {
        try {
            const date = new Date(`${dateString}T12:00:00Z`);

            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone,
                timeZoneName: 'longOffset'
            });

            const parts = formatter.formatToParts(date);
            const zone = parts.find((part) => part.type === 'timeZoneName')?.value ?? '';

            const match = zone.match(/GMT([+-])(\d{2}):?(\d{2})?/);

            if (!match) return 0;

            const sign = match[1] === '+' ? 1 : -1;
            const hours = Number(match[2]);
            const minutes = Number(match[3] ?? 0);

            return sign * (hours * 60 + minutes);
        } catch {
            return 0;
        }
    }

    function getTimezoneLabel(timeZone: string): string {
        try {
            const date = new Date();

            return new Intl.DateTimeFormat(undefined, {
                timeZone,
                timeZoneName: 'long'
            })
                .formatToParts(date)
                .find((part) => part.type === 'timeZoneName')?.value ?? timeZone;
        } catch {
            return timeZone;
        }
    }

    function getTimezoneDifference(): number {
        if (!plState.departureDate) return 0;

        const current = getTimezoneOffsetMinutes(
            plState.currentTz,
            plState.departureDate
        );

        const destination = getTimezoneOffsetMinutes(
            plState.destinationTz,
            plState.departureDate
        );

        return (destination - current) / 60;
    }

    function getShiftPerDay(): number {
        if (plState.speed === 'custom') {
            return Math.max(0.25, Math.min(4, plState.customShiftPerDay));
        }

        switch (plState.speed) {
            case 'gentle':
                return 0.5;

            case 'moderate':
                return 1;

            case 'fast':
                return 2;
        }
    }

    function getNumberOfDays(): number {
        const target = Math.abs(plState.targetShiftHours);
        const perDay = getShiftPerDay();

        return Math.max(1, Math.ceil(target / perDay));
    }

    function getDirection(): number {
        /*
         * Positive = destination is later than current timezone.
         *
         * If destination is ahead, the traveler needs to shift
         * their sleep/wake times later.
         *
         * If destination is behind, they need to shift earlier.
         */
        return getTimezoneDifference() >= 0 ? 1 : -1;
    }

    function buildSchedule(): ScheduleDay[] {
        if (!plState.departureDate) return [];

        const totalTarget = Math.abs(plState.targetShiftHours);
        const direction = getDirection();
        const perDay = getShiftPerDay();
        const days = getNumberOfDays();

        const originalSleep = timeToMinutes(plState.sleepTime);
        const originalWake = timeToMinutes(plState.wakeTime);

        const schedule: ScheduleDay[] = [];

        for (let i = 0; i <= days; i++) {
            const totalShift = Math.min(totalTarget, i * perDay);
            const previousShift = Math.min(totalTarget, Math.max(0, (i - 1) * perDay));

            const shiftApplied =
                i === 0 ? 0 : totalShift - previousShift;

            let sleepShift = totalShift;
            let wakeShift = totalShift;

            if (plState.priority === 'wake') {
                sleepShift = totalShift * 0.5;
            }

            if (plState.priority === 'bedtime') {
                wakeShift = totalShift * 0.5;
            }

            const sleepMinutes =
                originalSleep + direction * sleepShift * 60;

            const wakeMinutes =
                originalWake + direction * wakeShift * 60;

            schedule.push({
                day: i,
                date: addDays(plState.departureDate, i - days),
                sleep: minutesToTime(sleepMinutes),
                wake: minutesToTime(wakeMinutes),
                sleepMinutes,
                wakeMinutes,
                shiftApplied,
                totalShift
            });
        }

        return schedule;
    }

    let schedule = $derived(buildSchedule());

    let timezoneDifference = $derived(getTimezoneDifference());

    let targetDifference = $derived(Math.abs(plState.targetShiftHours));

    let finalSleep = $derived(
        schedule.length ? schedule[schedule.length - 1].sleep : plState.sleepTime
    );

    let finalWake = $derived(
        schedule.length ? schedule[schedule.length - 1].wake : plState.wakeTime
    );

    /* ---------------------------------------------------------
     * Validation
     * --------------------------------------------------------- */

    function canContinue(): boolean {
        switch (step) {
            case 0:
                return Boolean(plState.sleepTime && plState.wakeTime);

            case 1:
                return Boolean(plState.currentTz && plState.destinationTz);

            case 2:
                return Boolean(plState.departureDate);

            case 3:
                return plState.targetShiftHours > 0;

            case 4:
                return Boolean(plState.speed);

            default:
                return true;
        }
    }

    function next() {
        if (!canContinue()) return;

        step = Math.min(steps.length - 1, step + 1);
    }

    function savePlan() {
        if (!canContinue()) return;
        planSaved = true;
        step = steps.length - 1;
    }

    function editPlan() {
        planSaved = false;
        step = 0;
    }

    function previous() {
        step = Math.max(0, step - 1);
    }

    function reset() {
        plState = { ...defaults };
        step = 0;
        planSaved = false;

        if (browser) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(SAVED_KEY);
        }
    }

    /* ---------------------------------------------------------
     * JSON import/export
     * --------------------------------------------------------- */

    function exportJSON() {
        const json = JSON.stringify(plState, null, 2);

        const blob = new Blob([json], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = 'circadian-travel-plan.json';
        anchor.click();

        URL.revokeObjectURL(url);
    }

    function openImport() {
        importedFile?.click();
    }

    async function importJSON(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            if (!parsed || typeof parsed !== 'object') {
                throw new Error('Invalid JSON');
            }

            plState = {
                ...defaults,
                ...parsed
            };

            step = 0;
            planSaved = false;
        } catch {
            alert('That file does not contain a valid travel sleep plan.');
        }

        input.value = '';
    }

    /* ---------------------------------------------------------
     * UI helpers
     * --------------------------------------------------------- */

    function describeShift(): string {
        if (timezoneDifference === 0) {
            return 'Your destination is in the same UTC offset as your current location for the selected date.';
        }

        const direction = timezoneDifference > 0 ? 'ahead' : 'behind';
        const hours = Math.abs(timezoneDifference);

        return `${plState.destinationTz} is ${hours} hour${hours === 1 ? '' : 's'} ${direction} of ${plState.currentTz}.`;
    }

    function getTimeDescriptor(amount: number, skipCustomCheck: boolean = true): string {
        const totalMinutes = Math.round(amount * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;

        if (amount <= 0) return "0 minutes";
        return plState.speed === 'custom' && !skipCustomCheck ? 'a custom amount' : [
            h > 0 ? `${h} hour${h > 1 ? 's' : ''}` : '',
            m > 0 ? `${m} minute${m > 1 ? 's' : ''}` : ''
        ].filter(Boolean).join(' ');
    }

    function describeSpeed(): string {
        const amount = getShiftPerDay();
        const descriptor = getTimeDescriptor(amount, false);

        return `You chose ${descriptor} of shift per day. ${descs[plState.speed]}`;
    }
</script>

<Title title="Travel Timezone Adjustment" />

<div class="planner">
    <header class="header">
        <div>
            <h1>travel timezone adjustment</h1>
            <p class="subtitle">changing your circadian rhythm since 2026&trade;</p>
        </div>

        <div class="header-actions">
            <button type="button" onclick={exportJSON}>
                Export
            </button>

            <button type="button" onclick={openImport}>
                Import
            </button>

            <input
                bind:this={importedFile}
                type="file"
                accept="application/json,.json"
                onchange={importJSON}
                hidden
            />
        </div>
    </header>

    {#if !planSaved}
    <div class="steps" aria-label="Setup progress">
        {#each steps as label, index}
            <button
                type="button"
                class:active={index === step}
                class:complete={index < step}
                disabled={index > step}
                onclick={() => (step = index)}
            >
                <span>{index + 1}</span>
                {label}
            </button>
        {/each}
    </div>
    {/if}

    <main class="content">
        {#if planSaved}
            <section class="dashboard-hero">
                <div>
                    <h2>Ready for {plState.destinationTz.split('/').pop()?.replace(/_/g, ' ')}?</h2>
                    <p class="subtitle">Below is your adjustment schedule.</p>
                </div>
            </section>

            <section class="dashboard-grid">
                <article class="dashboard-card destination-card">
                    <span class="card-label">Destination</span>
                    <strong>{plState.destinationTz}</strong>
                    <span>{formatDate(plState.departureDate)} · {Math.abs(timezoneDifference)}h time difference</span>
                </article>
                <article class="dashboard-card">
                    <span class="card-label">Target schedule</span>
                    <div class="dashboard-times">
                        <div><span>Sleep</span><strong>{formatTime(finalSleep)}</strong></div>
                        <div><span>Wake</span><strong>{formatTime(finalWake)}</strong></div>
                    </div>
                </article>
                <article class="dashboard-card">
                    <span class="card-label">Adjustment pace</span>
                    <strong>{getTimeDescriptor(getShiftPerDay())} per day</strong>
                    <span>{schedule.length - 1} adjustment day{schedule.length - 1 === 1 ? '' : 's'}</span>
                </article>
            </section>

            <section class="panel dashboard-schedule">
                <div class="section-heading">
                    <div>
                        <h2>Sleep schedule</h2>
                    </div>
                    <button type="button" onclick={editPlan}>Edit plan</button>
                </div>
                <div class="schedule">
                    {#each schedule as day}
                        <article class="day" style={`--day-color: ${getScheduleColor(day.day, schedule.length)}`} class:arrival={day.day === schedule.length - 1} class:starting={day.day === 0} class:today={isToday(day.date)}>
                            <div class="day-header">
                                <strong>{isToday(day.date) ? 'Today' : day.day === 0 ? 'Starting schedule' : day.day === schedule.length - 1 ? 'Final adjusted schedule' : `Day ${day.day}`}</strong>
                                <span>{formatDate(day.date)}</span>
                            </div>
                            <div class="times">
                                <div><span>Sleep</span><strong>{formatTime(day.sleep)}</strong></div>
                                <div><span>Wake</span><strong>{formatTime(day.wake)}</strong></div>
                                <div><span>Shift</span><strong>{day.totalShift === 0 ? '—' : `${day.totalShift.toFixed(1)}h`}</strong></div>
                            </div>
                        </article>
                    {/each}
                </div>
            </section>
        {:else if step === 0}
            <section class="panel">
                <p class="eyebrow">Step 1</p>
                <h2>What's your normal sleep schedule?</h2>
                <p>
                    Adjust the dial to set your bedtime and wake time. Drag the ends of the handle or use the slider to change your sleep duration.
                </p>

                <div class="wheel-section">
                    <div class="wheel-container">
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <svg
                            bind:this={svgElement}
                            viewBox="0 0 340 340"
                            class="sleep-wheel-svg"
                            onpointermove={handlePointerMove}
                            onpointerup={handlePointerUp}
                            onpointercancel={handlePointerUp}
                        >
                            <defs>
                                <linearGradient id="sleepArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#2b7cff" />
                                    <stop offset="50%" stop-color="#30dbf2" />
                                    <stop offset="100%" stop-color="#57f295" />
                                </linearGradient>
                                <filter id="handleShadow" x="-30%" y="-30%" width="160%" height="160%">
                                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.6" />
                                </filter>
                            </defs>

                            <!-- Outer track circle -->
                            <circle
                                cx="170"
                                cy="170"
                                r="124"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.08)"
                                stroke-width="26"
                            />

                            <!-- Inner clock face background -->
                            <circle
                                cx="170"
                                cy="170"
                                r="96"
                                fill="#181818"
                                stroke="#333333"
                                stroke-width="1"
                            />

                            <!-- Dial Hour Ticks -->
                            {#each Array.from({ length: 48 }, (_, i) => i) as tickIndex}
                                {@const tickAngle = (tickIndex / 48) * 360}
                                {@const tRad = (tickAngle * Math.PI) / 180}
                                {@const isMajor = tickIndex % 2 === 0}
                                {@const isCardinal = tickIndex % 12 === 0}
                                {@const rIn = isCardinal ? 86 : isMajor ? 89 : 92}
                                <line
                                    x1={170 + rIn * Math.sin(tRad)}
                                    y1={170 - rIn * Math.cos(tRad)}
                                    x2={170 + 95 * Math.sin(tRad)}
                                    y2={170 - 95 * Math.cos(tRad)}
                                    stroke={isCardinal ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.25)'}
                                    stroke-width={isCardinal ? '2' : isMajor ? '1.5' : '1'}
                                    stroke-linecap="round"
                                />
                            {/each}

                            {#each dialHours as dh}
                                {@const rad = ((dh.hour / 24) * 360 * Math.PI) / 180}
                                <text
                                    x={170 + 74 * Math.sin(rad)}
                                    y={170 - 74 * Math.cos(rad) + 4}
                                    text-anchor="middle"
                                    class="dial-hour-text"
                                    class:cardinal={dh.hour % 6 === 0}
                                >
                                    {dh.label}
                                </text>
                            {/each}

                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <path
                                d={arcPath}
                                fill="none"
                                stroke="url(#sleepArcGradient)"
                                stroke-width="26"
                                stroke-linecap="round"
                                class="sleep-arc-path"
                                onpointerdown={(e) => handlePointerDown('arc', e)}
                            />

                            <!-- Internal ticks on the sleep arc -->
                            {#each Array.from({ length: 48 }, (_, i) => i) as tickIdx}
                                {@const tm = tickIdx * 30}
                                {#if isMinuteInArc(tm, sleepMinutes, wakeMinutes)}
                                    {@const aRad = ((tm / 1440) * 360 * Math.PI) / 180}
                                    <line
                                        x1={170 + 115 * Math.sin(aRad)}
                                        y1={170 - 115 * Math.cos(aRad)}
                                        x2={170 + 133 * Math.sin(aRad)}
                                        y2={170 - 133 * Math.cos(aRad)}
                                        stroke="rgba(255, 255, 255, 0.55)"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        pointer-events="none"
                                    />
                                {/if}
                            {/each}

                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <g
                                transform="translate({sleepCoords.x}, {sleepCoords.y})"
                                class="sleep-handle"
                                filter="url(#handleShadow)"
                                onpointerdown={(e) => handlePointerDown('bedtime', e)}
                            >
                                <circle cx="0" cy="0" r="17" fill="#1c2438" stroke="#3d74ff" stroke-width="2.5" />
                                <g transform="scale(0.018) translate(-480, 480)" fill="currentColor">
                                    <path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/>
                                </g>
                            </g>

                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <g
                                transform="translate({wakeCoords.x}, {wakeCoords.y})"
                                class="sleep-handle"
                                filter="url(#handleShadow)"
                                onpointerdown={(e) => handlePointerDown('wake', e)}
                            >
                                <circle cx="0" cy="0" r="17" fill="#142c26" stroke="#3be377" stroke-width="2.5" />
                                <g transform="scale(0.018) translate(-480, 480)" fill="currentColor">
                                    <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/>
                                </g>
                            </g>

                            <!-- Center Display -->
                            <text x="170" y="156" text-anchor="middle" class="wheel-center-label">
                                Sleep duration
                            </text>
                            <text x="170" y="180" text-anchor="middle" class="wheel-center-value">
                                {formatDurationLabel(sleepDurationMinutes)}
                            </text>
                        </svg>
                    </div>

                    <div class="wheel-controls">
                        <div class="time-cards">
                            <div class="time-card bedtime-card">
                                <div class="time-card-header">
                                    <span class="time-card-icon">🌙</span>
                                    <span class="time-card-title">Bedtime</span>
                                </div>
                                <div class="time-card-body">
                                    <strong class="time-card-time">{formatTime(plState.sleepTime)}</strong>
                                </div>
                            </div>

                            <div class="time-card wake-card">
                                <div class="time-card-header">
                                    <span class="time-card-icon">☀️</span>
                                    <span class="time-card-title">Wake time</span>
                                </div>
                                <div class="time-card-body">
                                    <strong class="time-card-time">{formatTime(plState.wakeTime)}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="duration-slider-section">
                            <div class="duration-slider-header">
                                <span>Adjust sleep duration</span>
                                <strong>{formatDurationLabel(sleepDurationMinutes)}</strong>
                            </div>

                            <input
                                type="range"
                                min="240"
                                max="720"
                                step="15"
                                value={sleepDurationMinutes}
                                oninput={(e) => setSleepDuration(Number(e.currentTarget.value))}
                                aria-label="Sleep duration slider"
                            />
                        </div>
                    </div>
                </div>
            </section>
        {:else if step === 1}
            <section class="panel">
                <p class="eyebrow">Step 2</p>
                <TimezonePicker
                    mode="dual"
                    bind:currentTz={plState.currentTz}
                    bind:destinationTz={plState.destinationTz}
                    departureDate={plState.departureDate}
                />

                {#if plState.departureDate}
                    <div class="info">
                        {describeShift()}
                    </div>
                {/if}
            </section>
        {:else if step === 2}
            <section class="panel">
                <p class="eyebrow">Step 3</p>
                <h2>When are you traveling?</h2>
                <p>
                    The date matters because UTC offsets can change with daylight
                    saving time.
                </p>

                <label>
                    <span>Departure date</span>
                    <input type="date" bind:value={plState.departureDate} />
                </label>

                {#if timezoneDifference !== 0}
                    <div class="summary">
                        <strong>{describeShift()}</strong>

                        <span>
                            The full timezone difference is
                            {Math.abs(timezoneDifference)} hour{Math.abs(timezoneDifference) === 1 ? '' : 's'}.
                        </span>
                    </div>
                {/if}
            </section>
        {:else if step === 3}
            <section class="panel">
                <p class="eyebrow">Step 4</p>
                <h2>How much do you want to adjust before traveling?</h2>
                <p>
                    You don't have to shift your entire schedule before departure.
                    Leaving some adjustment for after you arrive is completely fine.
                </p>

                <label>
                    <span>Hours to shift before departure</span>

                    <div class="range-row">
                        <input
                            type="range"
                            min="0"
                            max={Math.max(1, Math.abs(timezoneDifference))}
                            step="0.5"
                            bind:value={plState.targetShiftHours}
                        />

                        <output>{plState.targetShiftHours}h</output>
                    </div>
                </label>

                <div class="info">
                    Tip: For large timezone changes, trying to shift all the way to the local time at your destination is very impractical, so you're better off shifting just a few hours towards local time. This makes the transition less jarring once you arrive, while still keeping somewhat reasonable sleep/wake times in your home timezone.
                </div>
            </section>
        {:else if step === 4}
            <section class="panel">
                <p class="eyebrow">Step 5</p>
                <h2>How aggressively should the schedule move?</h2>
                <p>
                    This controls how much your sleep/wake times move each day.
                </p>

                <div class="choice-grid">
                    <label class="choice">
                        <input
                            type="radio"
                            name="speed"
                            value="gentle"
                            bind:group={plState.speed}
                        />

                        <strong>Gentle</strong>
                        <span>~30 minutes/day</span>
                    </label>

                    <label class="choice">
                        <input
                            type="radio"
                            name="speed"
                            value="moderate"
                            bind:group={plState.speed}
                        />

                        <strong>Moderate</strong>
                        <span>~1 hour/day</span>
                    </label>

                    <label class="choice">
                        <input
                            type="radio"
                            name="speed"
                            value="fast"
                            bind:group={plState.speed}
                        />

                        <strong>Fast</strong>
                        <span>~2 hours/day</span>
                    </label>

                    <label class="choice">
                        <input
                            type="radio"
                            name="speed"
                            value="custom"
                            bind:group={plState.speed}
                        />

                        <strong>Custom</strong>
                        <span>Choose your own rate</span>
                    </label>
                </div>

                {#if plState.speed === 'custom'}
                    <label>
                        <span>Hours shifted per day</span>

                        <input
                            type="number"
                            min="0.25"
                            max="4"
                            step="0.25"
                            bind:value={plState.customShiftPerDay}
                        />
                    </label>
                {/if}

                <div class="fields">
                    <label>
                        <span>What should be prioritized?</span>

                        <select bind:value={plState.priority}>
                            <option value="both">Shift sleep and wake together</option>
                            <option value="wake">Prioritize wake time</option>
                            <option value="bedtime">Prioritize bedtime</option>
                        </select>
                    </label>
                </div>

                <div class="info">
                    {describeSpeed()}
                </div>
            </section>
        {:else if step === 5}
            <section class="panel">
                <h2>adjustment plan</h2>

                <div class="summary">
                    <div>
                        <span>Current</span>
                        <strong>{plState.currentTz}</strong>
                    </div>

                    <div>
                        <span>Destination</span>
                        <strong>{plState.destinationTz}</strong>
                    </div>

                    <div>
                        <span>Target shift</span>
                        <strong>{targetDifference}h</strong>
                    </div>

                    <div>
                        <span>Rate</span>
                        <strong>{getTimeDescriptor(getShiftPerDay())}/day</strong>
                    </div>
                </div>

                <div class="schedule">
                    {#each schedule as day}
                        <article class="day" style={`--day-color: ${getScheduleColor(day.day, schedule.length)}`} class:arrival={day.day === schedule.length - 1} class:starting={day.day === 0} class:today={isToday(day.date)}>
                            <div class="day-header">
                                <strong>
                                    {isToday(day.date)
                                        ? 'Today'
                                        : day.day === 0
                                        ? 'Starting schedule'
                                        : day.day === schedule.length - 1
                                            ? 'Final adjusted schedule'
                                            : `Day ${day.day}`}
                                </strong>

                                <span>{formatDate(day.date)}</span>
                            </div>

                            <div class="times">
                                <div>
                                    <span>Sleep</span>
                                    <strong>{formatTime(day.sleep)}</strong>
                                </div>

                                <div>
                                    <span>Wake</span>
                                    <strong>{formatTime(day.wake)}</strong>
                                </div>

                                <div>
                                    <span>Shift</span>
                                    <strong>
                                        {day.totalShift === 0
                                            ? '—'
                                            : `${day.totalShift.toFixed(1)}h`}
                                    </strong>
                                </div>
                            </div>
                        </article>
                    {/each}
                </div>

                <div class="info">
                    Your final pre-travel target is approximately
                    <strong>{formatTime(finalSleep)}</strong>
                    to
                    <strong>{formatTime(finalWake)}</strong>.
                    After arrival, continue shifting toward the destination as needed.
                </div>
            </section>
        {/if}
    </main>

    <footer class="footer">
        <button type="button" onclick={reset}>
            Reset
        </button>

        <div class="navigation">
            {#if step > 0}
                <button type="button" onclick={previous}>
                    Back
                </button>
            {/if}

            {#if !planSaved && step < steps.length - 1}
                <button type="button" class="primary" disabled={!canContinue()} onclick={next}>Continue</button>
            {:else if !planSaved}
                <button type="button" class="primary" onclick={savePlan}>Save plan</button>
            {/if}
        </div>
    </footer>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    .planner {
        max-width: 1024px;
        margin: 0 auto;
        padding: 2rem;
        color: g.$light;
        font-family: g.$stack;
    }

    .header {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
        align-items: flex-start;
        margin-bottom: 2rem;
    }

    .header-actions {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .eyebrow {
        margin: 0 0 0.4rem;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: g.$primary;
    }

    h1,
    h2,
    p {
        margin-top: 0;
    }

    h1 {
        margin-bottom: 0.5rem;
        color: g.$light;
    }

    h2 {
        margin-bottom: 0.5rem;
        color: g.$light;
    }

    p {
        color: g.$darker-light;
        line-height: 1.5;
    }

    .subtitle {
        margin-bottom: 0;
        color: g.$darker-light;
        max-width: 650px;
    }

    .steps {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 1rem;
        margin-bottom: 1rem;

        button {
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: g.$darker-light;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 0.4rem;
            padding: 0.4rem 0.75rem;
            cursor: pointer;
            transition: all 0.2s ease;

            span {
                display: grid;
                place-items: center;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                background: lighten(g.$dark, 5%);
                border: 1px solid g.$border;
                color: g.$darker-light;
                font-size: 0.8rem;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            &:hover {
                color: g.$light;
                background: rgba(255, 255, 255, 0.05);
            }

            &.complete {
                color: g.$light;

                span {
                    background: g.$primary;
                    border-color: g.$primary;
                    color: g.$light;
                }
            }

            &.active {
                color: g.$light;
                font-weight: 600;
                background: rgba(g.$primary, 0.12);
                border-color: rgba(g.$primary, 0.35);

                span {
                    background: g.$primary;
                    border-color: g.$primary;
                    color: g.$light;
                }
            }
        }
    }

    .panel {
        padding: 2rem;
        background: lighten(g.$dark, 5%);
        border: 1px solid g.$border;
        border-radius: 0.5rem;

        > p:not(.eyebrow) {
            color: g.$darker-light;
            margin-bottom: 1.5rem;
        }
    }

    .dashboard-hero {
        display: flex;
        justify-content: space-between;
        gap: 1.5rem;
        align-items: flex-start;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid g.$border;
        border-radius: 0.5rem;
        background-color: lighten(g.$dark, 5%);
        
        h2 { margin-bottom: 0.5rem; }
        .subtitle { margin-bottom: 0; }
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .dashboard-card {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 1.2rem;
        border: 1px solid g.$border;
        border-radius: 0.5rem;
        background: lighten(g.$dark, 5%);

        strong { color: g.$light; font-size: 1.1rem; }
        > span:last-child { color: g.$darker-light; font-size: 0.85rem; }
    }

    .card-label {
        color: g.$primary !important;
        font-size: 0.8rem !important;
        font-weight: 500;
    }

    .dashboard-times {
        display: flex;
        gap: 1.5rem;

        div { display: flex; flex-direction: column; gap: 0.2rem; }
        span { color: g.$darker-light; font-size: 0.8rem; }
    }

    .section-heading {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;

        h2 { margin-bottom: 0; }
    }

    .dashboard-schedule { padding-top: 1.5rem; }

    .fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        margin-bottom: 1rem;

        > span {
            font-size: 0.85rem;
            font-weight: 600;
            color: g.$light;
        }
    }

    input,
    select,
    button {
        font-family: g.$stack;
    }

    input:not([type='radio']):not([type='range']),
    select {
        padding: 0.7rem 0.8rem;
        border: 1px solid g.$border;
        // border-radius: 0.5rem;
        background: g.$dark;
        color: g.$light;
        outline: none;
        transition: border-color 0.15s ease;

        &:focus {
            border-color: g.$primary;
        }
    }

    input[type='range'],
    input[type='radio'] {
        accent-color: g.$primary;
    }

    button {
        padding: 0.6rem 0.85rem;
        border: 1px solid g.$border;
        border-radius: 0.4rem;
        background: g.$dark;
        color: g.$light;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;

        &:hover:not(:disabled) {
            background: lighten(g.$dark, 5%);
            border-color: g.$light;
        }

        &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        &.primary {
            background: g.$primary;
            border-color: g.$primary;
            font-weight: 700;

            &:hover:not(:disabled) {
                background: g.$lighter-primary;
                border-color: g.$lighter-primary;
            }
        }
    }

    .info {
        margin-top: 1.25rem;
        padding: 1rem;
        border-radius: 0.5rem;
        background: rgba(g.$primary, 0.08);
        border: 1px solid rgba(g.$primary, 0.25);
        color: g.$light;
        line-height: 1.5;

        strong {
            color: g.$primary;
        }
    }

    .summary {
        margin: 1.5rem 0;

        &:has(> div) {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 1rem;

            > div {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                background: g.$dark;
                border: 1px solid g.$border;
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;

                span {
                    font-size: 0.8rem;
                    color: g.$darker-light;
                }

                strong {
                    font-size: 1.05rem;
                    color: g.$light;
                }
            }
        }

        &:not(:has(> div)) {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            background: g.$dark;
            border: 1px solid g.$border;
            border-radius: 0.5rem;
            padding: 0.85rem 1rem;

            strong {
                color: g.$light;
            }

            span {
                color: g.$darker-light;
            }
        }
    }

    .range-row {
        display: flex;
        align-items: center;
        gap: 1rem;

        input[type='range'] {
            flex: 1;
        }

        output {
            min-width: 4rem;
            text-align: right;
            font-weight: 700;
            color: g.$light;
        }
    }

    .choice-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }

    .choice {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        column-gap: 0.6rem;
        padding: 1rem;
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease;

        input {
            grid-row: 1 / 3;
            margin-top: 0.2rem;
        }

        strong {
            color: g.$light;
        }

        span {
            color: g.$darker-light;
            font-size: 0.85rem;
        }

        &:hover {
            border-color: g.$lighter-primary;
            background: lighten(g.$dark, 3%);
        }

        &:has(input:checked) {
            border-color: g.$primary;
            background: rgba(g.$primary, 0.1);
        }
    }

    .schedule {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin: 1.5rem 0;
    }

    .day {
        padding: 1rem;
        background: color-mix(in srgb, var(--day-color) 5%, transparent);
        border: 1px solid color-mix(in srgb, var(--day-color) 30%, transparent);
        border-radius: 0.3rem;
        position: relative;
        transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

        &:hover {
            transform: scale(1.003);
            z-index: 1;
            background: color-mix(in srgb, var(--day-color) 8%, transparent);
        }

        .day-header strong {
            color: var(--day-color);
            font-weight: 600;
        }

        &.arrival {
            border-width: 2px;
            .day-header strong {
                font-weight: 800;
            }
        }

        &.today {
            &::before {
                content: '';
                position: absolute;
                inset: 0.65rem auto 0.65rem 0;
                width: 3px;
                border-radius: 0 3px 3px 0;
                background: var(--day-color);
            }
            

            .day-header strong {
                font-weight: 800;
            }
        }

        &.starting {
            border-width: 2px;
            .day-header strong {
                font-weight: 800;
            }
        }
    }

    .day-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;

        strong {
            color: g.$light;
        }

        span {
            color: g.$darker-light;
            font-size: 0.85rem;
        }
    }

    .times {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;

        div {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        span {
            font-size: 0.8rem;
            color: g.$darker-light;
        }

        strong {
            color: g.$light;
        }
    }

    /* ---------------------------------------------------------
     * Sleep Wheel Styles
     * --------------------------------------------------------- */
    .wheel-section {
        display: grid;
        grid-template-columns: minmax(280px, 340px) 1fr;
        gap: 2rem;
        align-items: center;
        margin-top: 1.5rem;
    }

    .wheel-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .sleep-wheel-svg {
        width: 100%;
        max-width: 320px;
        height: auto;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        overflow: visible;
    }

    .dial-hour-text {
        fill: g.$darker-light;
        font-size: 10px;
        font-family: g.$stack;
        font-weight: 500;
        user-select: none;
        pointer-events: none;

        &.cardinal {
            fill: g.$light;
            font-size: 12px;
            font-weight: 700;
        }
    }

    .wheel-center-label {
        fill: g.$darker-light;
        font-size: 0.6rem;
        font-weight: 700;
        font-family: g.$stack;
        pointer-events: none;
        user-select: none;
    }

    .wheel-center-value {
        fill: g.$light;
        font-size: 18px;
        font-weight: 800;
        font-family: g.$stack;
        pointer-events: none;
        user-select: none;
    }

    .sleep-arc-path {
        cursor: grab;
        transition: stroke-width 0.15s ease;

        &:hover {
            stroke-width: 28;
        }

        &:active {
            cursor: grabbing;
        }
    }

    .sleep-handle {
        cursor: grab;

        g { transition: scale 0.15s ease }
        circle { transition: r 0.15s ease, stroke-width 0.15s ease }

        &:hover {
            circle { r: 19; stroke-width: 3 }
            g { scale: 1.15 }
        }

        &:active { cursor: grabbing }
    }

    .wheel-controls {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .time-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .time-card {
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.75rem;
        padding: 0.85rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        transition: border-color 0.15s ease;
    }

    .time-card-header {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .time-card-icon {
        font-size: 0.95rem;
    }

    .time-card-title {
        font-size: 0.78rem;
        font-weight: 600;
        color: g.$darker-light;
    }

    .time-card-body {
        display: flex;
        align-items: center;
    }

    .time-card-time {
        font-size: 1.25rem;
        font-weight: 700;
        color: g.$light;
    }

    .duration-slider-section {
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .duration-slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
            font-size: 0.85rem;
            font-weight: 600;
            color: g.$darker-light;
        }

        strong {
            font-size: 1.1rem;
            color: g.$primary;
        }
    }



    .footer {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;

        > button {
            &:hover:not(:disabled) {
                background: darken(g.$red, 20%);
                border-color: g.$red;
            }
        }
    }

    .navigation {
        display: flex;
        gap: 0.5rem;
    }

    @media (max-width: 700px) {
        .planner {
            padding: 1rem;
        }

        .header {
            flex-direction: column;
        }

        .wheel-section {
            grid-template-columns: 1fr;
            gap: 1.25rem;
        }

        .time-cards {
            grid-template-columns: 1fr;
        }

        .fields,
        .choice-grid,
        .summary:has(> div) {
            grid-template-columns: 1fr;
        }

        .dashboard-hero,
        .section-heading {
            flex-direction: column;
        }

        .dashboard-grid {
            grid-template-columns: 1fr;
        }

        .times {
            grid-template-columns: 1fr;
        }
    }
</style>
