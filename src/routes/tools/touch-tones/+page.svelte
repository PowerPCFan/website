<script lang="ts">
    import Title from "$lib/components/title.svelte";
    import { onMount } from "svelte";

    let context: AudioContext;
    let osc1: OscillatorNode | null = null, osc2: OscillatorNode | null = null, gainNode: GainNode | null = null;
    let mouseDown = $state(false);
    let draggingEnabled = $state(false);
    let volume = $state(0.25);

    onMount(() => {
        context = new (window.AudioContext || (window as any).webkitAudioContext)();
    });

    function playTone(frequency1: number, frequency2: number) {
        stopTone();
        osc1 = context.createOscillator();
        osc2 = context.createOscillator();
        gainNode = context.createGain();
        
        osc1.frequency.value = frequency1;
        osc2.frequency.value = frequency2;

        gainNode.gain.value = volume;

        osc1.connect(gainNode).connect(context.destination);
        osc2.connect(gainNode).connect(context.destination);

        osc1.start();
        osc2.start();
    }

    function playSingleTone(frequency: number) {
        stopTone();
        osc1 = context.createOscillator();
        gainNode = context.createGain();
        
        osc1.frequency.value = frequency;
        gainNode.gain.value = volume;

        osc1.connect(gainNode).connect(context.destination);
        osc1.start();
    }

    function stopTone() {
        if (osc1) {
            osc1.stop();
            osc1.disconnect();
            osc1 = null;
        }
        if (osc2) {
            osc2.stop();
            osc2.disconnect();
            osc2 = null;
        }
        if (gainNode) {
            gainNode.disconnect();
            gainNode = null;
        }
    }

    function handleKeyPress(tones: string) {
        const frequencies = tones.split(',');
        playTone(parseFloat(frequencies[0]), parseFloat(frequencies[1]));
        mouseDown = true;
    }

    function handleSingleTonePress(tone: string) {
        playSingleTone(parseFloat(tone));
        mouseDown = true;
    }

    function handleMouseEnter(tones?: string, tone?: string) {
        if (draggingEnabled && mouseDown) {
            if (tones) {
                const frequencies = tones.split(',');
                playTone(parseFloat(frequencies[0]), parseFloat(frequencies[1]));
            } else if (tone) {
                playSingleTone(parseFloat(tone));
            }
        }
    }

    function handleTouchEnter(event: TouchEvent, tones?: string, tone?: string) {
        if (draggingEnabled && mouseDown) {
            // Get the element under the touch point
            const touch = event.touches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Only trigger if we're over a button element
            if (elementBelow && (elementBelow.classList.contains('key') || elementBelow.classList.contains('small-button'))) {
                if (tones) {
                    const frequencies = tones.split(',');
                    playTone(parseFloat(frequencies[0]), parseFloat(frequencies[1]));
                } else if (tone) {
                    playSingleTone(parseFloat(tone));
                }
            }
        }
    }

    function handleGlobalMouseUp() {
        mouseDown = false;
        stopTone();
    }

    function handleGlobalTouchEnd() {
        mouseDown = false;
        stopTone();
    }
</script>

<Title title="Phone Touch Tone Simulator" />

<svelte:window 
    onmouseup={handleGlobalMouseUp} 
    ontouchend={handleGlobalTouchEnd} 
    ontouchcancel={handleGlobalTouchEnd} />

<div class="container">
    <div class="toggle">
        <label for="drag-toggle">Enable Dragging: </label>
        <input type="checkbox" id="drag-toggle" bind:checked={draggingEnabled}>
    </div>

    <div class="keypad-wrapper">
        <!-- Main Keypad -->
        <div class="keypad">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("697,1209")}
                 onmouseenter={() => handleMouseEnter("697,1209")}
                 ontouchstart={() => handleKeyPress("697,1209")}
                 ontouchmove={(e) => handleTouchEnter(e, "697,1209")}>1</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("697,1336")}
                 onmouseenter={() => handleMouseEnter("697,1336")}
                 ontouchstart={() => handleKeyPress("697,1336")}
                 ontouchmove={(e) => handleTouchEnter(e, "697,1336")}>2</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("697,1477")}
                 onmouseenter={() => handleMouseEnter("697,1477")}
                 ontouchstart={() => handleKeyPress("697,1477")}
                 ontouchmove={(e) => handleTouchEnter(e, "697,1477")}>3</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("770,1209")}
                 onmouseenter={() => handleMouseEnter("770,1209")}
                 ontouchstart={() => handleKeyPress("770,1209")}
                 ontouchmove={(e) => handleTouchEnter(e, "770,1209")}>4</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("770,1336")}
                 onmouseenter={() => handleMouseEnter("770,1336")}
                 ontouchstart={() => handleKeyPress("770,1336")}
                 ontouchmove={(e) => handleTouchEnter(e, "770,1336")}>5</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("770,1477")}
                 onmouseenter={() => handleMouseEnter("770,1477")}
                 ontouchstart={() => handleKeyPress("770,1477")}
                 ontouchmove={(e) => handleTouchEnter(e, "770,1477")}>6</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("852,1209")}
                 onmouseenter={() => handleMouseEnter("852,1209")}
                 ontouchstart={() => handleKeyPress("852,1209")}
                 ontouchmove={(e) => handleTouchEnter(e, "852,1209")}>7</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("852,1336")}
                 onmouseenter={() => handleMouseEnter("852,1336")}
                 ontouchstart={() => handleKeyPress("852,1336")}
                 ontouchmove={(e) => handleTouchEnter(e, "852,1336")}>8</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("852,1477")}
                 onmouseenter={() => handleMouseEnter("852,1477")}
                 ontouchstart={() => handleKeyPress("852,1477")}
                 ontouchmove={(e) => handleTouchEnter(e, "852,1477")}>9</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("941,1209")}
                 onmouseenter={() => handleMouseEnter("941,1209")}
                 ontouchstart={() => handleKeyPress("941,1209")}
                 ontouchmove={(e) => handleTouchEnter(e, "941,1209")}>*</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("941,1336")}
                 onmouseenter={() => handleMouseEnter("941,1336")}
                 ontouchstart={() => handleKeyPress("941,1336")}
                 ontouchmove={(e) => handleTouchEnter(e, "941,1336")}>0</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("941,1477")}
                 onmouseenter={() => handleMouseEnter("941,1477")}
                 ontouchstart={() => handleKeyPress("941,1477")}
                 ontouchmove={(e) => handleTouchEnter(e, "941,1477")}>#</div>
        </div>

        <!-- Vertical A, B, C, D Buttons -->
        <div class="vertical-buttons">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("697,1633")}
                 onmouseenter={() => handleMouseEnter("697,1633")}
                 ontouchstart={() => handleKeyPress("697,1633")}
                 ontouchmove={(e) => handleTouchEnter(e, "697,1633")}>A</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("770,1633")}
                 onmouseenter={() => handleMouseEnter("770,1633")}
                 ontouchstart={() => handleKeyPress("770,1633")}
                 ontouchmove={(e) => handleTouchEnter(e, "770,1633")}>B</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("852,1633")}
                 onmouseenter={() => handleMouseEnter("852,1633")}
                 ontouchstart={() => handleKeyPress("852,1633")}
                 ontouchmove={(e) => handleTouchEnter(e, "852,1633")}>C</div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="key" 
                 onmousedown={() => handleKeyPress("941,1633")}
                 onmouseenter={() => handleMouseEnter("941,1633")}
                 ontouchstart={() => handleKeyPress("941,1633")}
                 ontouchmove={(e) => handleTouchEnter(e, "941,1633")}>D</div>
        </div>
    </div>

    <!-- Small Buttons for Extra Tones -->
    <div class="small-buttons">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="small-button" 
             onmousedown={() => handleKeyPress("350,440")}
             onmouseenter={() => handleMouseEnter("350,440")}
             ontouchstart={() => handleKeyPress("350,440")}
             ontouchmove={(e) => handleTouchEnter(e, "350,440")}>Dial</div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="small-button" 
             onmousedown={() => handleKeyPress("480,620")}
             onmouseenter={() => handleMouseEnter("480,620")}
             ontouchstart={() => handleKeyPress("480,620")}
             ontouchmove={(e) => handleTouchEnter(e, "480,620")}>Busy</div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="small-button" 
             onmousedown={() => handleKeyPress("440,480")}
             onmouseenter={() => handleMouseEnter("440,480")}
             ontouchstart={() => handleKeyPress("440,480")}
             ontouchmove={(e) => handleTouchEnter(e, "440,480")}>Ringback</div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="small-button" 
             onmousedown={() => handleSingleTonePress("2600")}
             onmouseenter={() => handleMouseEnter(undefined, "2600")}
             ontouchstart={() => handleSingleTonePress("2600")}
             ontouchmove={(e) => handleTouchEnter(e, undefined, "2600")}>2600Hz</div>
    </div>

    <!-- Volume Control -->
    <div class="volume-control">
        <label for="volume-slider">Volume</label>
        <input type="range" id="volume-slider" min="0" max="0.5" step="0.01" bind:value={volume}>
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .container {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .toggle {
        margin-bottom: 10px;
    }

    .keypad-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        flex-direction: row;
    }

    .keypad {
        display: grid;
        grid-template-columns: repeat(3, 100px);
        gap: 10px;
        padding-top: 10px;
    }

    .key {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.25rem;  /* Increased font size for large keys */
        width: 100px;
        height: 100px;
        background-color: g.$light;
        color: g.$dark;
        border-radius: 10px;
        cursor: pointer;
        user-select: none;
        text-align: center;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;

        transition: background-color 0.2s ease;

        &:hover {
            background-color: darken(g.$light, 15);
        }

        &:active {
            background-color: darken(g.$light, 25);
            transform: scale(0.95);
        }
    }

    .vertical-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px; /* Adjusted to fix alignment */
        padding-right: 10px;
    }

    .small-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        padding-top: 15px;
        margin-right: 10px;
    }

    .small-button {
        width: 100px;
        height: 50px;
        background-color: g.$light;
        color: g.$dark;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 18px;
        text-align: center;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;

        transition: background-color 0.2s ease, transform 0.1s ease;

        &:hover {
            background-color: darken(g.$light, 15);
        }

        &:active {
            background-color: darken(g.$light, 25);
            transform: scale(0.95);
        }
    }

    .volume-control {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;

        input[type="range"] {
            width: 200px;
        }
    }
</style>