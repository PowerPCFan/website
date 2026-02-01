<script>
    import { onMount, onDestroy } from "svelte";

    const WS_URL = "wss://radio-playing.expect.ovh";
    const STREAM_URL = "https://radio.expect.ovh/radio.ogg";

    let ws;

    let song = "—";
    let votes = 0;
    let required = 3;

    let lastSong = null;
    let votedForSong = null;
    let audio;
    let isPlaying = false;

    function togglePlay() {
        if (audio.paused) {
            audio.src = audio.src;
            audio.load();
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
    }

    function connectWS() {
        ws = new WebSocket(WS_URL);

        ws.onmessage = (e) => {
            const s = JSON.parse(e.data);

            song = s.now_playing
                ? s.now_playing.replace(".mp3", "")
                : "—";

            votes = s.votes;
            required = s.required;

            if (s.now_playing && s.now_playing !== lastSong) {
                votedForSong = null;
            }

            lastSong = s.now_playing;
        };

        ws.onclose = () => {
            setTimeout(connectWS, 2000);
        };

        ws.onerror = () => ws.close();
    }

    function voteSkip() {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (votedForSong === lastSong) return;

        ws.send("vote-skip");
        votedForSong = lastSong;
    }

    onMount(connectWS);

    onDestroy(() => {
        if (ws) ws.close();
    });
</script>

<h2>Portal 2 Radio</h2>

<p>{song}</p>

<button on:click={voteSkip} disabled={votedForSong === lastSong}>
    Skip
</button>

<p>{votes} / {required} votes to skip</p>

<audio bind:this={audio} src={STREAM_URL} bind:volume />

<div class="player">
    <button on:click={togglePlay}>
        {isPlaying ? "⏸" : "▶"}
    </button>
</div>
