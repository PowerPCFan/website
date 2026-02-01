<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const WS_URL = "wss://radio-playing.expect.ovh";
  const STREAM_URL = "https://radio.expect.ovh/radio.ogg";
  const ALBUM_IMAGE = "https://preview.redd.it/u9lmxzc797l71.jpg?width=1080&crop=smart&auto=webp&s=cbbf69571b6dc34c619dd48add08c70e37144a40";

  let ws: WebSocket;
  let audio: HTMLAudioElement;
  let vinyl: HTMLDivElement;

  let song = "—", votes = 0, required = 3;
  let lastSong: string | null = null, votedForSong: string | null = null;
  let isPlaying = false;
  let rotation = 0, lastTimestamp = 0;

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      lastTimestamp = performance.now();
    } else {
      audio.play().catch(() => audio.load() && audio.play());
      isPlaying = true;
      lastTimestamp = performance.now();
      requestAnimationFrame(animateVinyl);
    }
  }

  function animateVinyl(ts: number) {
    if (!isPlaying) return;
    const delta = ts - lastTimestamp;
    rotation += (delta / 4000) * 360; // 4s per full rotation
    rotation %= 360;
    vinyl.style.transform = `rotate(${rotation}deg)`;
    lastTimestamp = ts;
    requestAnimationFrame(animateVinyl);
  }

  function connectWS() {
    ws = new WebSocket(WS_URL);
    ws.onmessage = ({ data }) => {
      const s = JSON.parse(data);
      song = s.now_playing?.replace(".mp3", "") || "—";
      votes = s.votes || 0;
      required = s.required || 3;
      if (s.now_playing && s.now_playing !== lastSong) votedForSong = null;
      lastSong = s.now_playing;
    };
    ws.onclose = ws.onerror = () => setTimeout(connectWS, 2000);
  }

  function voteSkip() {
    if (ws?.readyState === WebSocket.OPEN && votedForSong !== lastSong) {
      ws.send("vote-skip");
      votedForSong = lastSong;
    }
  }

  onMount(connectWS);
  onDestroy(() => ws?.close());
</script>

<div class="center">
  <h2>Portal 2 Radio</h2>

  <div bind:this={vinyl} class="vinyl">
    <img src={ALBUM_IMAGE} alt="Album Cover" />
    <div class="hole"></div>
  </div>

  <div class="track-info">
    <div class="track-name">{song}</div>
    <div class="track-artist">{votes} / {required} votes to skip</div>
  </div>

  <div class="controls">
    <button on:click={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
    <button on:click={voteSkip} disabled={votedForSong === lastSong}>Skip</button>
  </div>

  <audio bind:this={audio} src={STREAM_URL}></audio>
</div>

<style>
.center { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; text-align:center; }

.vinyl { width:96px; height:96px; border-radius:50%; overflow:hidden; border:3px solid #000; box-shadow:0 0 8px rgba(0,0,0,0.6); position:relative; transform: rotate(0deg); transition: transform 0s linear; }
.vinyl img { width:100%; height:100%; object-fit:cover; }
.hole { position:absolute; inset:42%; background:#000; border-radius:50%; z-index:2; }

.track-name { font-weight:bold; }
.track-artist { font-size:0.9rem; color:gray; }
.controls { display:flex; gap:12px; }
</style>
