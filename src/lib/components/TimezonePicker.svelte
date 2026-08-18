<script lang="ts">
    import timezonesData from '$lib/data/timezones.json';

    interface TimezoneEntry {
        timezone: string;
        country: string;
        pin: string;
        offset: number;
        points: string;
        zonename: string;
    }

    const timezones: TimezoneEntry[] = timezonesData as TimezoneEntry[];

    let {
        mode = 'dual',
        value = $bindable('America/New_York'),
        currentTz = $bindable('America/New_York'),
        destinationTz = $bindable('Europe/Helsinki'),
        departureDate = '',
        onchange
    }: {
        mode?: 'single' | 'dual';
        value?: string;
        currentTz?: string;
        destinationTz?: string;
        departureDate?: string;
        onchange?: (selected: string, target?: 'current' | 'destination' | 'single') => void;
    } = $props();

    let activeTarget = $state<'current' | 'destination'>('destination');
    let hoveredZone = $state<TimezoneEntry | null>(null);

    let activeTimezoneString = $derived(
        mode === 'single' ? value : activeTarget === 'current' ? currentTz : destinationTz
    );

    let currentEntry = $derived(
        timezones.find((t) => t.timezone === (mode === 'single' ? value : currentTz)) || timezones[0]
    );

    let destinationEntry = $derived(
        timezones.find((t) => t.timezone === (mode === 'single' ? value : destinationTz)) || timezones[1]
    );

    // Island zones = fewer than 6 x,y coordinate pairs (points are comma-separated: "x1,y1,x2,y2,...")
    function isSmallZone(points: string): boolean {
        const numValues = points.split(',').length;
        const numPoints = numValues / 2; // each pair is x,y
        return numPoints < 4;
    }

    // DST-aware offset string using the browser's Intl API
    function getLiveOffset(tz: string, dateString?: string): string {
        try {
            const date = dateString ? new Date(`${dateString}T12:00:00Z`) : new Date();
            const parts = new Intl.DateTimeFormat('en', {
                timeZone: tz,
                timeZoneName: 'shortOffset'
            }).formatToParts(date);
            const raw = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
            return raw.replace('GMT', 'UTC').replace(/\+0$|−0$|-0$/, '+0') || formatOffset(0);
        } catch {
            return '';
        }
    }

    let currentPinCoords = $derived.by(() => {
        if (!currentEntry?.pin) return { x: 125, y: 75 };
        const [x, y] = currentEntry.pin.split(',').map(Number);
        return { x: x || 125, y: y || 75 };
    });

    let destinationPinCoords = $derived.by(() => {
        if (!destinationEntry?.pin) return { x: 140, y: 80 };
        const [x, y] = destinationEntry.pin.split(',').map(Number);
        return { x: x || 140, y: y || 80 };
    });

    let flightArcD = $derived.by(() => {
        const p1 = currentPinCoords;
        const p2 = destinationPinCoords;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const curveOffset = Math.min(35, Math.max(12, dist * 0.2));
        const cx = mx;
        const cy = my - curveOffset;
        return `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
    });

    const quickLinks = [
        { label: 'NYC', tz: 'America/New_York' },
        { label: 'LON', tz: 'Europe/London' },
        { label: 'PAR', tz: 'Europe/Paris' },
        { label: 'TYO', tz: 'Asia/Tokyo' },
        { label: 'SYD', tz: 'Australia/Sydney' },
        { label: 'LAX', tz: 'America/Los_Angeles' },
        { label: 'DXB', tz: 'Asia/Dubai' },
        { label: 'UTC', tz: 'UTC' }
    ];

    const uniqueTimezones = $derived.by(() => {
        const seen = new Set<string>();
        const list: TimezoneEntry[] = [];
        for (const tz of timezones) {
            if (!seen.has(tz.timezone)) {
                seen.add(tz.timezone);
                list.push(tz);
            }
        }
        return list;
    });

    function setTimezone(tz: string) {
        if (mode === 'single') {
            value = tz;
            onchange?.(tz, 'single');
        } else if (activeTarget === 'current') {
            currentTz = tz;
            onchange?.(tz, 'current');
        } else {
            destinationTz = tz;
            onchange?.(tz, 'destination');
        }
    }

    let manualOffsetInput = $state('');
    let manualOffsetError = $state('');

    function applyManualOffset() {
        // Accept formats: -5, +5.5, 5:30, -5:30, UTC+8, GMT-3, etc.
        const raw = manualOffsetInput.trim().replace(/^(UTC|GMT)/i, '');
        const match = raw.match(/^([+-]?\d{1,2})(?::(\d{2}))?$/);
        if (!match) {
            manualOffsetError = 'Use a format like -5, +5:30, or 5.5';
            return;
        }
        manualOffsetError = '';
        const hours = parseInt(match[1], 10);
        const mins = match[2] ? parseInt(match[2], 10) : 0;
        const offsetDecimal = hours + (hours < 0 ? -mins / 60 : mins / 60);

        // Find the closest matching timezone by static offset
        const best = uniqueTimezones.reduce((prev, cur) => {
            return Math.abs(cur.offset - offsetDecimal) < Math.abs(prev.offset - offsetDecimal) ? cur : prev;
        });
        setTimezone(best.timezone);
        manualOffsetInput = '';
    }

    function swapTimezones() {
        const temp = currentTz;
        currentTz = destinationTz;
        destinationTz = temp;
    }

    function formatOffset(offset: number): string {
        const sign = offset >= 0 ? '+' : '-';
        const abs = Math.abs(offset);
        const hours = Math.floor(abs);
        const mins = Math.round((abs - hours) * 60);
        return mins === 0 ? `UTC${sign}${hours}` : `UTC${sign}${hours}:${String(mins).padStart(2, '0')}`;
    }

    function getTimezoneDisplayName(tz: string, dateString?: string): string {
        try {
            const date = dateString ? new Date(`${dateString}T12:00:00Z`) : new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'long'
            });
            const parts = formatter.formatToParts(date);
            const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? tz;
            const offsetStr = getLiveOffset(tz, dateString);
            return `${name} ${offsetStr ? `(${offsetStr})` : ''}`;
        } catch {
            return tz;
        }
    }

    const fullCountryName = new Intl.DisplayNames(["en"], { type: "region" });

    function getFullNameOf(countryCode: string): string {
        try {
            return fullCountryName.of(countryCode) || countryCode;
        } catch {
            return countryCode;
        }
    }
</script>

<div class="tz-picker-widget">
    <div class="tz-header">
        <h2 class="tz-window-title">Select a timezone</h2>
    </div>

    {#if mode === 'dual'}
        <div class="tz-target-tabs">
            <button
                type="button"
                class="tz-tab origin-tab"
                class:active={activeTarget === 'current'}
                onclick={() => (activeTarget = 'current')}
            >
                <span class="tab-pin origin-pin"></span>
                <div class="tab-details">
                    <span class="tab-label">Current Timezone</span>
                    <strong class="tab-city">{currentEntry.timezone.split('/').pop()?.replace(/_/g, ' ')} ({getFullNameOf(currentEntry.country)})</strong>
                </div>
            </button>

            <button
                type="button"
                class="swap-btn"
                onclick={swapTimezones}
                title="Swap Origin & Destination"
                aria-label="Swap origin and destination"
            >
                ⇄
            </button>

            <button
                type="button"
                class="tz-tab destination-tab"
                class:active={activeTarget === 'destination'}
                onclick={() => (activeTarget = 'destination')}
            >
                <span class="tab-pin destination-pin"></span>
                <div class="tab-details">
                    <span class="tab-label">Destination</span>
                    <strong class="tab-city">{destinationEntry.timezone.split('/').pop()?.replace(/_/g, ' ')} ({getFullNameOf(destinationEntry.country)})</strong>
                </div>
            </button>
        </div>
    {/if}

    <div class="map-viewport">
        <svg
            viewBox="0 0 500 250"
            class="timezone-map"
            class:target-destination={mode === 'dual' && activeTarget === 'destination'}
            aria-label="World timezone interactive map"
        >
            <defs>
                <filter id="tzPinGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.8" />
                </filter>
            </defs>

            <rect width="500" height="250" class="ocean" />

            <g class="polygons-group">
                {#each timezones as zone, idx (idx)}
                    {@const isCurrent = mode === 'dual' && zone.timezone === currentTz}
                    {@const isDestination = mode === 'dual' && zone.timezone === destinationTz}
                    {@const isSingleSelected = mode === 'single' && zone.timezone === value}
                    {@const isActiveFocus = mode === 'single' ? isSingleSelected : (activeTarget === 'current' ? isCurrent : isDestination)}
                    {@const isHoveredTz = hoveredZone && zone.timezone === hoveredZone.timezone}
                    {@const isHoveredOffset = hoveredZone && zone.offset === hoveredZone.offset && zone.timezone !== hoveredZone.timezone}
                    {@const small = isSmallZone(zone.points)}
                    {@const pinXY = zone.pin ? zone.pin.split(',').map(Number) : [250, 125]}

                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <polygon
                        points={zone.points}
                        class="zone-polygon"
                        class:single-selection={isSingleSelected}
                        class:current-selection={isCurrent}
                        class:destination-selection={isDestination}
                        class:active-focus={isActiveFocus}
                        class:same-timezone-hover={isHoveredTz && !isSingleSelected && !isCurrent && !isDestination}
                        class:same-offset-hover={isHoveredOffset && !isSingleSelected && !isCurrent && !isDestination}
                        onmouseenter={() => (hoveredZone = zone)}
                        onmouseleave={() => (hoveredZone = null)}
                        onclick={() => setTimezone(zone.timezone)}
                    />
                    {#if small}
                        <!-- Invisible enlarged hit target for tiny island zones -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <circle
                            cx={pinXY[0]}
                            cy={pinXY[1]}
                            r="9"
                            fill="transparent"
                            stroke="none"
                            class="island-hit-target"
                            onmouseenter={() => (hoveredZone = zone)}
                            onmouseleave={() => (hoveredZone = null)}
                            onclick={() => setTimezone(zone.timezone)}
                        />
                    {/if}
                {/each}
            </g>

            <!-- Flight Connection Arc in Dual Mode -->
            {#if mode === 'dual' && currentTz !== destinationTz}
                <path
                    d={flightArcD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.75)"
                    stroke-width="1.5"
                    stroke-dasharray="3 2"
                    class="flight-path"
                    pointer-events="none"
                />
            {/if}

            <!-- Origin Pin -->
            {#if mode === 'dual'}
                <g transform="translate({currentPinCoords.x}, {currentPinCoords.y})" class="map-pin origin" filter="url(#tzPinGlow)" pointer-events="none">
                    <circle cx="0" cy="0" r="4" fill="#3d74ff" stroke="#ffffff" stroke-width="1.2" />
                </g>
            {/if}

            <!-- Destination / Single Pin -->
            <g
                transform="translate({mode === 'dual' ? destinationPinCoords.x : currentPinCoords.x}, {mode === 'dual' ? destinationPinCoords.y : currentPinCoords.y})"
                class="map-pin destination"
                filter="url(#tzPinGlow)"
                pointer-events="none"
            >
                <circle cx="0" cy="0" r="4" fill="#3be377" stroke="#ffffff" stroke-width="1.2" />
            </g>
        </svg>

        <div class="hover-bar">
            {#if hoveredZone}
                <span>{hoveredZone.timezone} ({getLiveOffset(hoveredZone.timezone, departureDate)})</span>
            {:else}
                <span class="muted-hint">Hover over the map or click a location to select</span>
            {/if}
        </div>
    </div>

    <!-- Apple-style Selection Controls -->
    <div class="apple-controls-card">
        <div class="control-row">
            <span class="control-label">Timezone:</span>
            <strong class="control-value">
                {getTimezoneDisplayName(activeTimezoneString, departureDate)}
            </strong>
        </div>

        <div class="control-row">
            <span class="control-label">Closest city:</span>
            <div class="select-dropdown-container">
                <select
                    value={activeTimezoneString}
                    onchange={(e) => setTimezone(e.currentTarget.value)}
                    class="apple-select"
                >
                    {#each uniqueTimezones as zone (zone.timezone)}
                        <option value={zone.timezone}>{zone.timezone.replace(/_/g, ' ')} ({getFullNameOf(zone.country)})</option>
                    {/each}
                </select>
                <span class="select-arrow">▾</span>
            </div>
        </div>
    </div>

    <div class="manual-offset-row">
        <label class="manual-offset-label" for="manual-offset-input">Incorrect? Manually enter UTC offset:</label>
        <div class="manual-offset-input-group">
            <input
                id="manual-offset-input"
                type="text"
                class="manual-offset-input"
                class:error={!!manualOffsetError}
                bind:value={manualOffsetInput}
                placeholder="e.g. -5, +2"
                onkeydown={(e) => e.key === 'Enter' && applyManualOffset()}
            />
            <button type="button" class="manual-offset-apply" onclick={applyManualOffset}>Apply</button>
        </div>
        {#if manualOffsetError}
            <span class="manual-offset-error">{manualOffsetError}</span>
        {/if}
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    * {
        font-family: g.$stack;
    }

    .tz-picker-widget {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        color: g.$light;
    }

    .tz-header {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(g.$border, 0.3);
    }

    .tz-window-title {
        margin: 0;
        color: g.$light;
    }

    .tz-target-tabs {
        display: flex;
        align-items: stretch;
        gap: 0.6rem;
    }

    .tz-tab {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.6rem;
        padding: 0.6rem 0.85rem;
        cursor: pointer;
        text-align: left;
        transition: all 0.15s ease;

        .tab-pin {
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            flex-shrink: 0;

            &.origin-pin {
                background: #3d74ff;
            }

            &.destination-pin {
                background: #3be377;
            }
        }

        .tab-details {
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
            overflow: hidden;
        }

        .tab-label {
            font-size: 0.7rem;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: g.$darker-light;
        }

        .tab-city {
            font-size: 0.92rem;
            color: g.$light;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &:hover {
            background: lighten(g.$dark, 4%);
            border-color: g.$lighter-primary;
        }

        &.active {
            border-color: g.$primary;
            background: rgba(g.$primary, 0.12);
        }
    }

    .swap-btn {
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.6rem;
        padding: 0 0.9rem;
        font-size: 1.15rem;
        color: g.$light;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        transition: all 0.15s ease;

        &:hover {
            background: rgba(g.$primary, 0.2);
            border-color: g.$primary;
        }
    }

    .map-viewport {
        width: 100%;
        background: #11151c;
        border: 1px solid g.$border;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
        position: relative;
    }

    .timezone-map {
        width: 100%;
        height: auto;
        display: block;
        cursor: pointer;
        user-select: none;
    }

    .ocean {
        fill: #141822;
    }

    .zone-polygon {
        fill: #3b4252;
        stroke: #252a36;
        stroke-width: 0.4;
        transition: fill 0.12s ease, stroke 0.12s ease;
        cursor: pointer;

        &:hover {
            fill: rgba(61, 116, 255, 0.68);
            stroke: #ffffff;
            stroke-width: 0.75;
        }

        &.same-timezone-hover {
            fill: rgba(61, 116, 255, 0.25);
            stroke: rgba(61, 116, 255, 0.5);
            stroke-width: 0.5;
        }

        &.same-offset-hover {
            fill: rgba(61, 116, 255, 0.08);
            stroke: rgba(255, 255, 255, 0.15);
            stroke-width: 0.4;
        }

        &.single-selection,
        &.current-selection {
            fill: #3d74ff !important;
            stroke: #3d74ff !important;
            stroke-width: 0.6;
        }

        &.destination-selection {
            fill: #3be377 !important;
            stroke: #3be377 !important;
            stroke-width: 0.6;
        }

        &.active-focus {
            &.single-selection,
            &.current-selection {
                stroke: #ffffff !important;
                stroke-width: 0.9 !important;
                filter: drop-shadow(0 0 3px rgba(61, 116, 255, 0.85));
            }

            &.destination-selection {
                stroke: #ffffff !important;
                stroke-width: 0.9 !important;
                filter: drop-shadow(0 0 3px rgba(59, 227, 119, 0.85));
            }
        }
    }

    /* Green hover palette when destination tab is active */
    .timezone-map.target-destination .zone-polygon {
        &:hover {
            fill: rgba(59, 227, 119, 0.68);
        }

        &.same-timezone-hover {
            fill: rgba(59, 227, 119, 0.25);
            stroke: rgba(59, 227, 119, 0.5);
        }

        &.same-offset-hover {
            fill: rgba(59, 227, 119, 0.08);
        }
    }

    .island-hit-target {
        cursor: pointer;
    }

    .flight-path {
        stroke-dashoffset: 0;
        animation: flightDash 1.5s linear infinite;
    }

    @keyframes flightDash {
        to {
            stroke-dashoffset: -10;
        }
    }

    .hover-bar {
        background: rgba(15, 18, 26, 0.95);
        border-top: 1px solid rgba(g.$border, 0.3);
        padding: 0.35rem 0.75rem;
        font-size: 0.85rem;
        color: g.$light;
        min-height: 1.6rem;
        display: flex;
        align-items: center;

        .muted-hint {
            color: g.$darker-light;
            font-style: italic;
        }
    }

    .apple-controls-card {
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.75rem;
        padding: 0.9rem 1.15rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .control-row {
        display: grid;
        grid-template-columns: 100px 1fr;
        gap: 1rem;
        align-items: center;
    }

    .control-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: g.$darker-light;
    }

    .control-value {
        font-size: 0.95rem;
        color: g.$light;
    }

    .select-dropdown-container {
        position: relative;
        display: flex;
        align-items: center;

        .apple-select {
            width: 100%;
            appearance: none;
            -webkit-appearance: none;
            background: #252a36;
            border: 1px solid g.$border;
            border-radius: 0.45rem;
            color: g.$light;
            font-size: 0.9rem;
            padding: 0.5rem 2rem 0.5rem 0.75rem;
            cursor: pointer;
            outline: none;

            &:focus {
                border-color: g.$primary;
                box-shadow: 0 0 0 2px rgba(g.$primary, 0.3);
            }
        }

        .select-arrow {
            position: absolute;
            right: 0.75rem;
            color: g.$light;
            pointer-events: none;
            font-size: 1.5rem;
            bottom: 0.325rem;
        }
    }

    @media (max-width: 700px) {
        .tz-target-tabs {
            flex-direction: column;
        }

        .control-row {
            grid-template-columns: 1fr;
            gap: 0.35rem;
        }
    }

    .manual-offset-row {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding-top: 0.1rem;
    }

    .manual-offset-label {
        font-size: 0.78rem;
        color: g.$darker-light;
    }

    .manual-offset-input-group {
        display: flex;
        gap: 0.5rem;
    }

    .manual-offset-input {
        flex: 1;
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.4rem;
        color: g.$light;
        font-size: 0.85rem;
        padding: 0.35rem 0.65rem;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;

        &::placeholder {
            color: g.$darker-light;
            opacity: 0.7;
        }

        &:focus {
            border-color: g.$primary;
            box-shadow: 0 0 0 2px rgba(g.$primary, 0.2);
        }

        &.error {
            border-color: g.$red;
            box-shadow: 0 0 0 2px rgba(g.$red, 0.2);
        }
    }

    .manual-offset-apply {
        background: g.$dark;
        border: 1px solid g.$border;
        border-radius: 0.4rem;
        color: g.$lighter-primary;
        font-size: 0.82rem;
        font-weight: 600;
        padding: 0.35rem 0.75rem;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;

        &:hover {
            background: rgba(g.$primary, 0.15);
            border-color: g.$primary;
            color: g.$light;
        }
    }

    .manual-offset-error {
        font-size: 0.75rem;
        color: g.$red;
    }
</style>
