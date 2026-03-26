<script lang="ts">
    import Title from "$lib/components/title.svelte";
    import { onMount } from "svelte";

    type ToneStep = {
        frequencies: number[];
        durationMs: number;
    };

    type SweepConfig = {
        minHz: number;
        maxHz: number;
        rateHz: number;
        harmonicLimitHz?: number;
        harmonicRollOff?: number;
        onMs?: number;
        offMs?: number;
    };

    type SoundPreset = {
        name: string;
        description: string;
        category: number;
        loop: boolean;
        jitterHz?: number;
        sweep?: SweepConfig;
        introSequence?: ToneStep[];
        sustainFrequencies?: number[];
        frequencies?: number[];
        sequence?: ToneStep[];
        oneShotMs?: number;
    };

    const categoryLabels: Record<number, string> = {
        0: "Emergency Alerting",
        1: "Telecom",
        2: "Miscellaneous",
    };

    const categories: number[] = [0, 1, 2];

    const presets: SoundPreset[] = [
        {
            name: "EAS Attention",
            description: "A two-tone alert played by the US's Emergency Alert System",
            category: 0,
            loop: true,
            frequencies: [853, 960],
        },
        {
            name: "NOAA 1050Hz",
            description: "NOAA Weather Radio's alert tone",
            category: 0,
            loop: true,
            frequencies: [1050],
        },
        {
            name: "1000 Hz",
            description: "Commonly used for calibration & testing",
            category: 2,
            loop: true,
            frequencies: [1000]
        },
        {
            name: "Dial Tone",
            description: "Indicates that a line is ready to make a call",
            category: 1,
            loop: true,
            frequencies: [350, 440],
        },
        {
            name: "Recall Dial",
            description: "Three quick on/off bursts, then continuous dial tone",
            category: 1,
            loop: true,
            introSequence: [
                { frequencies: [350, 440], durationMs: 100 },
                { frequencies: [], durationMs: 100 },
                { frequencies: [350, 440], durationMs: 100 },
                { frequencies: [], durationMs: 100 },
                { frequencies: [350, 440], durationMs: 100 },
                { frequencies: [], durationMs: 100 },
            ],
            sustainFrequencies: [350, 440],
        },
        {
            name: "Busy Signal",
            description: "Indicates that a line is busy",
            category: 1,
            loop: true,
            sequence: [
                { frequencies: [480, 620], durationMs: 500 },
                { frequencies: [], durationMs: 500 },
            ],
        },
        {
            name: "Ringback",
            description: "The 'ringing' sound heard when a call is connecting",
            category: 1,
            loop: true,
            sequence: [
                { frequencies: [440, 480], durationMs: 2000 },
                { frequencies: [], durationMs: 4000 },
            ],
        },
        {
            name: "Reorder",
            description: "Known as 'fast busy'; indicates that a call can't be completed",
            category: 1,
            loop: true,
            sequence: [
                { frequencies: [480, 620], durationMs: 250 },
                { frequencies: [], durationMs: 250 },
            ]
        },
        {
            name: "Special Information Tone",
            description: "Series of tones played before an automated message",
            category: 1,
            loop: false,
            sequence: [
                { frequencies: [950], durationMs: 320 },
                { frequencies: [1400], durationMs: 320 },
                { frequencies: [1800], durationMs: 320 },
            ]
        },
        {
            name: "Special Information Tone (Historical)",
            description: "Some systems used slightly different frequencies/spacing",
            category: 1,
            loop: false,
            jitterHz: 5,
            sequence: [
                { frequencies: [913.8], durationMs: 274 },
                { frequencies: [1370.6], durationMs: 274 },
                { frequencies: [1776.7], durationMs: 380 },
            ]
        },
        {
            name: "Off-hook",
            description: "Tone indicating that a phone has been left off-hook",
            category: 1,
            loop: true,
            sequence: [
                { frequencies: [1400, 2060, 2450, 2600], durationMs: 100 },
                { frequencies: [], durationMs: 100 }
            ]
        },
        {
            name: "Call waiting tone",
            description: "The beep indicating another call is waiting while you're on a call",
            category: 1,
            loop: true,
            sequence: [
                { frequencies: [440], durationMs: 500 },
                { frequencies: [], durationMs: 500 },
                { frequencies: [440], durationMs: 500 },
                { frequencies: [], durationMs: 10000 },
            ]
        },
        {
            name: "No Such Number",
            description: "200-400Hz sweep that rises and falls continuously",
            category: 1,
            loop: true,
            sweep: {
                minHz: 200,
                maxHz: 400,
                rateHz: 1,
                harmonicLimitHz: 6000,
                harmonicRollOff: 1.25,
                onMs: 6000,
                offMs: 1000,
            }
        }
    ];

    type ActiveSound = {
        token: number;
        oscillators: OscillatorNode[];
        partialGainNodes: GainNode[];
        jitterIntervals: Array<ReturnType<typeof window.setInterval>>;
        gainNode: GainNode | null;
    };

    let context: AudioContext;
    const activeSounds = new Map<string, ActiveSound>();
    let tokenCounter = 0;
    const VOLUME_STORAGE_KEY = "soundboard.volume";

    let volume = $state(0.25);
    let playingPresetNames = $state<string[]>([]);
    let debugMode = $state(false);

    onMount(() => {
        context = new (window.AudioContext || (window as any).webkitAudioContext)();

        try {
            const savedVolume = window.localStorage.getItem(VOLUME_STORAGE_KEY);
            if (savedVolume !== null) {
                const parsed = Number(savedVolume);
                if (Number.isFinite(parsed)) {
                    volume = Math.max(0, Math.min(0.5, parsed));
                }
            }
        } catch {
            // Ignore storage access failures.
        }

        return () => {
            stopAll();
        };
    });

    async function ensureAudioContext() {
        if (context.state === "suspended") {
            await context.resume();
        }
    }

    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function setPlaying(name: string, playing: boolean) {
        if (playing) {
            if (!playingPresetNames.includes(name)) {
                playingPresetNames = [...playingPresetNames, name];
            }
            return;
        }

        if (playingPresetNames.includes(name)) {
            playingPresetNames = playingPresetNames.filter((presetName) => presetName !== name);
        }
    }

    function isPlaying(name: string): boolean {
        return playingPresetNames.includes(name);
    }

    function clearOscillators(active: ActiveSound) {
        for (const intervalId of active.jitterIntervals) {
            window.clearInterval(intervalId);
        }
        active.jitterIntervals = [];

        for (const oscillator of active.oscillators) {
            oscillator.stop();
            oscillator.disconnect();
        }
        active.oscillators = [];

        for (const node of active.partialGainNodes) {
            node.disconnect();
        }
        active.partialGainNodes = [];
    }

    function setSoundFrequencies(active: ActiveSound, frequencies: number[], jitterHz = 0) {
        clearOscillators(active);

        if (frequencies.length === 0) {
            return;
        }

        if (!active.gainNode) {
            active.gainNode = context.createGain();
            active.gainNode.connect(context.destination);
        }

        active.gainNode.gain.value = volume;
        for (const frequency of frequencies) {
            const oscillator = context.createOscillator();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;

            if (jitterHz > 0) {
                const intervalId = window.setInterval(() => {
                    const jitter = (Math.random() * 2 - 1) * jitterHz;
                    const nextFrequency = Math.max(1, frequency + jitter);
                    oscillator.frequency.setValueAtTime(nextFrequency, context.currentTime);
                }, 70);
                active.jitterIntervals.push(intervalId);
            }

            oscillator.connect(active.gainNode);
            oscillator.start();
            active.oscillators.push(oscillator);
        }
    }

    function setSweepTone(active: ActiveSound, sweep: SweepConfig) {
        clearOscillators(active);

        if (!active.gainNode) {
            active.gainNode = context.createGain();
            active.gainNode.connect(context.destination);
        }

        active.gainNode.gain.value = volume;

        const harmonicLimitHz = Math.max(sweep.maxHz, sweep.harmonicLimitHz ?? sweep.maxHz);
        const harmonicRollOff = sweep.harmonicRollOff ?? 1.15;
        const harmonicCount = Math.max(1, Math.floor(harmonicLimitHz / sweep.maxHz));

        const harmonicAmplitudes = Array.from({ length: harmonicCount }, (_, index) => 1 / Math.pow(index + 1, harmonicRollOff));
        const amplitudeSum = harmonicAmplitudes.reduce((sum, value) => sum + value, 0) || 1;

        const harmonicOscillators: OscillatorNode[] = [];

        for (let i = 0; i < harmonicCount; i += 1) {
            const harmonicNumber = i + 1;
            const oscillator = context.createOscillator();
            oscillator.type = "sine";
            oscillator.frequency.value = sweep.minHz * harmonicNumber;

            const partialGain = context.createGain();
            partialGain.gain.value = harmonicAmplitudes[i] / amplitudeSum;

            oscillator.connect(partialGain);
            partialGain.connect(active.gainNode);

            oscillator.start();
            active.oscillators.push(oscillator);
            active.partialGainNodes.push(partialGain);
            harmonicOscillators.push(oscillator);
        }

        const startTime = context.currentTime;
        const sweepOnMs = Math.max(1, sweep.onMs ?? Infinity);
        const sweepOffMs = Math.max(0, sweep.offMs ?? 0);
        const cadenceMs = Number.isFinite(sweepOnMs) ? sweepOnMs + sweepOffMs : Infinity;

        const intervalId = window.setInterval(() => {
            const elapsedSeconds = context.currentTime - startTime;
            const elapsedMs = elapsedSeconds * 1000;

            if (Number.isFinite(cadenceMs)) {
                const cyclePosMs = elapsedMs % cadenceMs;
                if (cyclePosMs >= sweepOnMs) {
                    active.gainNode!.gain.setValueAtTime(0, context.currentTime);
                    return;
                }
            }

            active.gainNode!.gain.setValueAtTime(volume, context.currentTime);

            const phase = (elapsedSeconds * sweep.rateHz) % 1;
            const triangle = phase < 0.5 ? phase * 2 : 2 - phase * 2;
            const nextBaseFrequency = sweep.minHz + triangle * (sweep.maxHz - sweep.minHz);

            for (let i = 0; i < harmonicOscillators.length; i += 1) {
                const harmonicNumber = i + 1;
                harmonicOscillators[i].frequency.setValueAtTime(nextBaseFrequency * harmonicNumber, context.currentTime);
            }
        }, 20);

        active.jitterIntervals.push(intervalId);
    }

    function stopPreset(name: string) {
        const active = activeSounds.get(name);
        if (!active) {
            return;
        }

        clearOscillators(active);

        if (active.gainNode) {
            active.gainNode.disconnect();
            active.gainNode = null;
        }

        activeSounds.delete(name);
        setPlaying(name, false);
    }

    async function playPreset(preset: SoundPreset) {
        await ensureAudioContext();

        stopPreset(preset.name);
        const token = ++tokenCounter;

        const active: ActiveSound = {
            token,
            oscillators: [],
            partialGainNodes: [],
            jitterIntervals: [],
            gainNode: null,
        };

        activeSounds.set(preset.name, active);
        setPlaying(preset.name, true);
        const jitterHz = preset.jitterHz ?? 0;

        if (preset.sweep) {
            setSweepTone(active, preset.sweep);

            if (!preset.loop) {
                await delay(preset.oneShotMs ?? 2000);
                if (activeSounds.get(preset.name)?.token === token) {
                    stopPreset(preset.name);
                }
            }

            return;
        }

        if (preset.frequencies) {
            setSoundFrequencies(active, preset.frequencies, jitterHz);

            if (!preset.loop) {
                await delay(preset.oneShotMs ?? 1200);
                if (activeSounds.get(preset.name)?.token === token) {
                    stopPreset(preset.name);
                }
            }

            return;
        }

        if (preset.introSequence && preset.sustainFrequencies) {
            for (const step of preset.introSequence) {
                if (activeSounds.get(preset.name)?.token !== token) {
                    return;
                }
                setSoundFrequencies(active, step.frequencies, jitterHz);
                await delay(step.durationMs);
            }

            if (activeSounds.get(preset.name)?.token === token) {
                setSoundFrequencies(active, preset.sustainFrequencies, jitterHz);
            }

            if (!preset.loop) {
                await delay(preset.oneShotMs ?? 1200);
                if (activeSounds.get(preset.name)?.token === token) {
                    stopPreset(preset.name);
                }
            }

            return;
        }

        if (!preset.sequence || preset.sequence.length === 0) {
            stopPreset(preset.name);
            return;
        }

        if (preset.loop) {
            let stepIndex = 0;

            while (activeSounds.get(preset.name)?.token === token) {
                const step = preset.sequence[stepIndex % preset.sequence.length];
                setSoundFrequencies(active, step.frequencies, jitterHz);
                await delay(step.durationMs);
                stepIndex += 1;
            }
            return;
        }

        for (const step of preset.sequence) {
            if (activeSounds.get(preset.name)?.token !== token) {
                return;
            }
            setSoundFrequencies(active, step.frequencies, jitterHz);
            await delay(step.durationMs);
        }

        if (activeSounds.get(preset.name)?.token === token) {
            stopPreset(preset.name);
        }
    }

    function stopAll() {
        const names = Array.from(activeSounds.keys());
        for (const name of names) {
            stopPreset(name);
        }
    }

    $effect(() => {
        const currentVolume = volume;

        try {
            window.localStorage.setItem(VOLUME_STORAGE_KEY, String(currentVolume));
        } catch {
            // Ignore storage access failures.
        }

        for (const active of activeSounds.values()) {
            if (active.gainNode) {
                active.gainNode.gain.value = currentVolume;
            }
        }
    });
</script>

<Title title="Sine Wave Soundboard" />

<div class="container">
    <h1 ondblclick={() => (debugMode = !debugMode)}>Sine Wave Soundboard</h1>

    <div class="controls">
        <div class="field">
            <label for="volume-slider">Volume: {Math.round(volume*200)}%</label>
            <input id="volume-slider" type="range" min="0" max="0.5" step="0.005" bind:value={volume} />
        </div>

        <button class="stop-button" type="button" onclick={stopAll}>Stop All</button>
    </div>

    {#each categories as category}
        <section class="category-section">
            <h2>{categoryLabels[category]}</h2>
            <div class="preset-grid">
                {#each presets.filter((preset) => preset.category === category) as preset}
                    <div class="preset-card">
                        <span class="name">{preset.name}</span>
                        <span class="description">{preset.description}</span>

                        {#if debugMode}
                            <div class="debug-panel">
                                <div><strong>loop:</strong> {preset.loop ? "true" : "false"}</div>
                                <div><strong>jitter:</strong> {preset.jitterHz && preset.jitterHz > 0 ? preset.jitterHz : "disabled"}</div>
                                <div><strong>one-shot duration (ms):</strong> {preset.oneShotMs ?? "n/a"}</div>
                                {#if preset.sweep}
                                    <div>
                                        <strong>sweep:</strong>
                                        {preset.sweep.minHz}-{preset.sweep.maxHz}Hz @ {preset.sweep.rateHz}Hz, on {preset.sweep.onMs ?? "inf"}ms / off {preset.sweep.offMs ?? 0}ms
                                    </div>
                                {/if}
                                {#if preset.sweep?.harmonicLimitHz || preset.sweep?.harmonicRollOff}
                                    <div>
                                        <strong>harmonics:</strong>
                                        limit {preset.sweep?.harmonicLimitHz ?? "base"}Hz, rolloff {preset.sweep?.harmonicRollOff ?? "default"}
                                    </div>
                                {/if}
                                {#if preset.frequencies}
                                    <div>
                                        <strong>frequencies:</strong>
                                        {preset.frequencies ? `${preset.frequencies.length > 1 ? "[" : ""}${preset.frequencies.join(" Hz, ")+" Hz"}${preset.frequencies.length > 1 ? "]" : ""}` : "n/a"}
                                    </div>
                                {/if}

                                {#if preset.introSequence}
                                    <div>
                                        <strong>intro sequence:</strong>
                                        <ul>
                                            {#each preset.introSequence as step, stepIndex}
                                                <li>
                                                    {#if step.frequencies.length === 1}
                                                        #{stepIndex + 1}: {step.frequencies[0]} Hz for {step.durationMs}ms
                                                    {:else if step.frequencies.length > 1}
                                                        #{stepIndex + 1}: [{step.frequencies.join(" Hz, ")+" Hz"}] for {step.durationMs}ms
                                                    {:else}
                                                        #{stepIndex + 1}: Silence for {step.durationMs}ms
                                                    {/if}
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}

                                {#if preset.sustainFrequencies}
                                    <div>
                                        <strong>sustain:</strong>
                                        {preset.sustainFrequencies.length > 1 ? `[${preset.sustainFrequencies.join(" Hz, ")} Hz]` : `${preset.sustainFrequencies[0]} Hz`}
                                    </div>
                                {/if}

                                {#if preset.sequence}
                                    <div>
                                        <strong>sequence:</strong>
                                        <ul>
                                            {#each preset.sequence as step, stepIndex}
                                                <li>
                                                    {#if step.frequencies.length === 1}
                                                        #{stepIndex + 1}: {step.frequencies[0]} Hz for {step.durationMs}ms
                                                    {:else if step.frequencies.length > 1}
                                                        #{stepIndex + 1}: [{step.frequencies.join(" Hz, ")+" Hz"}] for {step.durationMs}ms
                                                    {:else}
                                                        #{stepIndex + 1}: Silence for {step.durationMs}ms
                                                    {/if}
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}
                            </div>
                        {/if}

                        <div class="card-buttons">
                            <button
                                class="toggle-button {isPlaying(preset.name) ? 'stop' : 'play'}"
                                type="button"
                                onclick={() => (isPlaying(preset.name) ? stopPreset(preset.name) : playPreset(preset))}
                            >
                                {isPlaying(preset.name) ? "Stop" : "Play"}
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </section>
    {/each}
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h1 {
        margin: 0;
    }

    h2 {
        margin: 0;
        font-size: 1.1rem;
    }

    .controls {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        align-items: end;
        background: #252525;
        border: 1px solid g.$border;
        border-radius: 0.75rem;
        padding: 1rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .stop-button {
        border: 1px solid g.$border;
        border-radius: 0.6rem;
        color: g.$light;
        font-family: g.$stack;
        cursor: pointer;
        background: darken(g.$red, 20%);
        padding: 0.5rem 1rem;
    }

    .card-buttons button {
        border: 1px solid g.$border;
        border-radius: 0.6rem;
        color: g.$light;
        font-family: g.$stack;
        cursor: pointer;
    }

    .category-section {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .preset-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 0.75rem;
    }

    .preset-card {
        background: #252525;
        border: 1px solid g.$border;
        border-radius: 0.6rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        gap: 0.25rem;
        padding: 0.75rem;

        .name {
            font-size: 1rem;
            font-weight: 700;
        }

        .description {
            color: g.$darker-light;
            font-size: 0.85rem;
        }
    }

    .debug-panel {
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.5rem;
        border: 1px dashed g.$border;
        border-radius: 0.5rem;
        background: g.$dark;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        font-size: 0.75rem;

        ul {
            margin-top: 0.25rem;
            margin-left: 1.25rem;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }
    }

    .card-buttons {
        width: 100%;
        display: flex;
        margin-top: 0.5rem;

        .toggle-button {
            width: 100%;
            padding: 0.5rem 0.75rem;
            background: #303030;
            border: 1px solid g.$border;
            border-radius: 0.6rem;
            color: g.$light;
            font-family: g.$stack;
            cursor: pointer;
        }

        .toggle-button.stop {
            background: darken(g.$red, 20%);
        }
    }

    input[type="range"] {
        width: 100%;
    }

    @media (max-width: 760px) {
        .container {
            padding: 1rem;
        }

        .controls {
            grid-template-columns: 1fr;
        }
    }
</style>