<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Title from "$lib/components/title.svelte";

    const WS_URL = "wss://radio-playing.expect.ovh";
    const STREAM_URL = "https://radio.expect.ovh/radio.ogg";

    const PLAY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>`;
    const PAUSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>`;

    let ws: WebSocket;
    let audio: HTMLAudioElement;
    let vinyl: HTMLDivElement;
    let requiredVotesElement: HTMLDivElement;

    let song = $state("Loading...");
    let votes = $state(0);
    let required = $state(3);
    let lastSong: string | null = $state(null);
    let votedForSong: string | null = $state(null);
    let isPlaying = $state(false);
    let rotation = $state(0);
    let lastTimestamp = $state(0);

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            lastTimestamp = performance.now();
            // resetVinyl();
        } else {
            audio.play().catch(() => {
                audio.load();
                audio.play();
            });
            isPlaying = true;
            lastTimestamp = performance.now();
            requestAnimationFrame(animateVinyl);
        }
    }

    function resetVinyl() {
        rotation = 0;
        vinyl.style.transform = `rotate(0deg)`;
    }

    function animateVinyl(ts: number) {
        const secondsPerRotation: number = 5;

        if (!isPlaying) return;
        const delta = ts - lastTimestamp;
        rotation += (delta / (secondsPerRotation * 1000)) * 360;
        rotation %= 360;
        vinyl.style.transform = `rotate(${rotation}deg)`;
        lastTimestamp = ts;
        requestAnimationFrame(animateVinyl);
    }

    function connectWS() {
        ws = new WebSocket(WS_URL);
        ws.onmessage = ({ data }) => {
            const s = JSON.parse(data);
            song = s.now_playing?.replace(".mp3", "") || "Loading...";
            votes = s.votes || 0;
            required = s.required || 3;
            if (s.now_playing && s.now_playing !== lastSong) votedForSong = null;
            lastSong = s.now_playing;
        };
        ws.onclose = ws.onerror = (() => {
            setTimeout(() => {
                connectWS()
            }, 2000);
        });
    }

    function sleep(s: number) {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

    async function voteSkip() {
        let skipped = false;

        if (ws?.readyState === WebSocket.OPEN && votedForSong !== lastSong) {
            ws.send("vote-skip");
            votedForSong = lastSong;
            skipped = true;

            const oldContent = requiredVotesElement.textContent;

            requiredVotesElement.textContent = "Voting for skip...";
            await sleep(0.8);
            requiredVotesElement.textContent = "Voted successfully!";
            await sleep(1);
            requiredVotesElement.textContent = oldContent;
        }
    }

    onMount(() => {
        connectWS();
    });
    onDestroy(() => (
        ws?.close()
    ));
</script>

<Title title="{song ? song + " | " : ""}Portal 2 Radio" />

<div class="background">
    <video autoplay muted loop playsinline>
        <source src="/portal-radio/wallpaper.mp4" type="video/mp4" />
    </video>
</div>

<div class="main-container">
    <h1>Portal 2 Radio</h1>

    <div bind:this={vinyl} class="vinyl">
        <img src="/portal-radio/album.jpg" alt="Album Cover" />
        <div class="hole"></div>
    </div>

    <div class="track-info">
        <div class="track-name">{song}</div>
        <div bind:this={requiredVotesElement} class="track-artist">{votes} / {required} votes to skip</div>
    </div>

    <div class="controls">
        <button class="playpause" onclick={togglePlay}><div class="icon">{@html isPlaying ? PAUSE : PLAY}</div></button>
        <button onclick={voteSkip} disabled={votedForSong === lastSong}>Skip</button>
    </div>

    <audio bind:this={audio} src={STREAM_URL}></audio>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .main-container {
        // min-height: 50vh;
        height: 100%;
        width: 100%;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        gap: 16px;
        text-align: center;
    }

    button {
        font-size: 1rem;
        font-family: g.$stack;
        background-color: g.$primary;
        color: g.$light;
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        padding-block: 0.5rem;
        padding-inline: 1rem;

        &.playpause {
            padding-block: 0;
            padding-inline: 0.4rem;
            border-radius: 2rem;
        }

        &:disabled {
            color: g.$darker-light;
            background-color: darken(g.$primary, 20%);
            cursor: not-allowed;
        }

        .icon {
            width: 1.5rem;
            height: 1.5rem;

            :global(svg) {
                width: 100%;
                height: 100%;
                fill: g.$light;
            }
        }
    }

    .vinyl {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid g.$light;
        position: relative;
        transform: rotate(0deg);
        transition: transform 0s linear;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .hole {
        position: absolute;
        inset: 42%;
        background: #000;
        border-radius: 50%;
        z-index: 2;
    }

    .track-name {
        font-weight: bold;
    }

    .track-artist {
        font-size: 0.9rem;
        color: gray;
    }

    .controls {
        display: flex;
        gap: 12px;
    }
</style>
