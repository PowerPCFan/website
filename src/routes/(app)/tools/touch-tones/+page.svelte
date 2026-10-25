<script lang="ts">
    import Title from "$lib/components/title.svelte";
    import { onMount } from "svelte";

    let context: AudioContext;
    let osc1: OscillatorNode | null = null
    let osc2: OscillatorNode | null = null
    let gainNode: GainNode | null = null;
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
            const touch = event.touches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

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

{#snippet buttonBase(tone: string, text: string, btnClass: string)}
    {#if tone.includes(',')}
        <div
            class={btnClass}
            onmousedown={() => handleKeyPress(tone)}
            onmouseenter={() => handleMouseEnter(tone)}
            ontouchstart={() => handleKeyPress(tone)}
            ontouchmove={(e) => handleTouchEnter(e, tone)}
        >{text}</div>
    {:else}
        <div
            class={btnClass}
            onmousedown={() => handleSingleTonePress(tone)}
            onmouseenter={() => handleMouseEnter(undefined, tone)}
            ontouchstart={() => handleSingleTonePress(tone)}
            ontouchmove={(e) => handleTouchEnter(e, undefined, tone)}
        >{text}</div>
    {/if}
{/snippet}

{#snippet button(tone: string, text: string)}
    {@const btnClass = `
        flex justify-center items-center text-4xl w-25 h-25 bg-foreground text-background
        rounded-[10px] cursor-pointer text-center [user-select:none] [-webkit-user-select:none]
        [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]
        touch-manipulation transition-all duration-200 ease-in-out hover:bg-foreground/90
        active:bg-card-foreground/75 active:scale-95
    `}

    {@render buttonBase(tone, text, btnClass)}
{/snippet}

{#snippet smallButton(tone: string, text: string)}
    {@const btnClass = `
        flex justify-center items-center text-lg w-25 h-12.5 bg-foreground text-background
        rounded-[10px] cursor-pointer text-center [user-select:none] [-webkit-user-select:none]
        [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]
        touch-manipulation transition-all duration-200 ease-in-out hover:bg-foreground/90
        active:bg-card-foreground/75 active:scale-95
    `}

    {@render buttonBase(tone, text, btnClass)}
{/snippet}

<div class="p-8 flex flex-col items-center">
    <div class="mb-2.5">
        <label for="drag-toggle">Enable Dragging: </label>
        <input type="checkbox" id="drag-toggle" bind:checked={draggingEnabled}>
    </div>

    <div class="flex flex-row items-start gap-2.5">
        <div class="grid grid-cols-[repeat(3,100px)] gap-2.5 pt-2.5">
            {@render button("697,1209", "1")}
            {@render button("697,1336", "2")}
            {@render button("697,1477", "3")}

            {@render button("770,1209", "4")}
            {@render button("770,1336", "5")}
            {@render button("770,1477", "6")}

            {@render button("852,1209", "7")}
            {@render button("852,1336", "8")}
            {@render button("852,1477", "9")}

            {@render button("941,1209", "*")}
            {@render button("941,1336", "0")}
            {@render button("941,1477", "#")}
        </div>

        <div class="flex flex-col gap-2.5 mt-2.5 pr-2.5">
            {@render button("697,1633", "A")}
            {@render button("770,1633", "B")}
            {@render button("852,1633", "C")}
            {@render button("941,1633", "D")}
        </div>
    </div>

    <div class="flex flex-wrap justify-center gap-2.5 pt-3.5 mr-2.5">
        {@render smallButton("350,440", "Dial")}
        {@render smallButton("480,620", "Busy")}
        {@render smallButton("440,480", "Ringback")}
        {@render smallButton("2600", "2600Hz")}
    </div>

    <div class="mt-3.5 flex flex-col items-center">
        <label for="vol-slider">Volume</label>
        <input type="range" class="w-50" id="vol-slider" min="0" max="0.5" step="0.01" bind:value={volume}>
    </div>
</div>
