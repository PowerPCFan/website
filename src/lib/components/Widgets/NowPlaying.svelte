<script lang="ts">
    import { getLatestSongVars } from "$lib/utils/lastfm";
    import { onMount } from "svelte";

    import Card from "$lib/components/Card/Card.svelte";
    import CardContent from "$lib/components/Card/CardContent.svelte";
    import CardHeader from "$lib/components/Card/CardHeader.svelte";
    import MusicBars from "$lib/components/Card/Utilities/MusicBars.svelte";
    import CircularStatusIndicator from "$lib/components/Card/Utilities/CircularStatusIndicator.svelte";
    import StatusText from "$lib/components/Card/Utilities/StatusText.svelte";

    let { username } = $props();

    let isLoading: boolean = $state(true);
    let isNowPlaying: boolean | undefined = $state();
    let trackName: string | undefined = $state();
    let trackUrl: string | undefined = $state();
    let artistName: string | undefined = $state();
    let albumName: string | undefined = $state();
    let bestImage: string | undefined = $state();
    let errorCode: string | undefined = $state();

    const THROW_ERROR_FOR_DEBUG = false; // simulates http error 500
    const MAX_RETRIES = 3; // amount of retry attempts
    const RETRY_DELAY_MS = 1000; // delay between retries, in millseconds
    const pollInterval = 30000; // 30 seconds

    function open_thing_in_new_tab(thing: string | undefined) {
        if (thing) {
            window.open(thing, '_blank');
        }
    }

    async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

    async function loadSongWithRetry() {
        let attempt = 0;
        let lastErrorCode: string | undefined;
        while (attempt < MAX_RETRIES) {
            if (THROW_ERROR_FOR_DEBUG) {
                // Simulate a 500 error for this attempt
                lastErrorCode = '500';
            } else {
                try {
                    const song = await getLatestSongVars(username);
                    if (!song.errorCode) {
                        // Success
                        errorCode = undefined;
                        isNowPlaying = song.isNowPlaying;
                        trackName = song.trackName;
                        trackUrl = song.trackUrl;
                        artistName = song.artistName;
                        albumName = song.albumName;
                        bestImage = song.images.best;
                        return true;
                    } else {
                        lastErrorCode = song.errorCode;
                    }
                } catch (e) {
                    lastErrorCode = 'INTERNAL_ERROR';
                }
            }
            attempt++;
            if (attempt < MAX_RETRIES) {
                await sleep(RETRY_DELAY_MS);
            }
        }
        errorCode = lastErrorCode;
        return false;
    }

    onMount(async () => {
        await loadSongWithRetry();
        isLoading = false;

        setInterval(loadSongWithRetry, pollInterval);
    });
</script>

{#if isLoading}
<Card height_100percent>
    <CardHeader>
        <CircularStatusIndicator loading />
        <StatusText>Loading last.fm status...</StatusText>
    </CardHeader>
</Card>
{:else if errorCode}
<Card height_100percent error>
    <CardHeader>
        <CircularStatusIndicator error />
        <StatusText>Error loading last.fm data</StatusText>
    </CardHeader>
    <CardContent>
        <div class="generic-error">Please try again later.</div>
    </CardContent>
</Card>
{:else if trackName && artistName}
<Card height_100percent>
    <CardHeader>
        {#if isNowPlaying}
            <MusicBars />
        {:else}
            <CircularStatusIndicator />
        {/if}
        <StatusText>
            {isNowPlaying ? 'Now Playing' : 'Last Played'}
        </StatusText>
    </CardHeader>
    
    <CardContent>
        {#if bestImage}
        <div class="album-art">
            <button title="Click to open album cover in new tab" id="album-art-click" onclick={() => open_thing_in_new_tab(bestImage)} onkeydown={(e) => { if (e.key.toLowerCase() === 'enter') open_thing_in_new_tab(bestImage); }}>
                <img loading="lazy" src={bestImage} alt="Album art for {albumName}" />
            </button>
        </div>
        {/if}
        
        <div class="track-info">
            <div class="track-name">
                {#if trackUrl}
                <a href={trackUrl} target="_blank" rel="noopener noreferrer">
                    {trackName}
                </a>
                {:else}
                {trackName}
                {/if}
            </div>
            <div class="artist-name">{artistName}</div>
            {#if albumName}
            <div class="album-name">{albumName}</div>
            {/if}
        </div>
    </CardContent>
</Card>
{/if}

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .album-art {
        flex-shrink: 0;
        
        #album-art-click {
            all: unset;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;

            transition: transform 0.2s ease;

            &:hover {
                cursor: pointer;
                transform: scale(1.08);
            }
        
            img {
                width: 90px;
                height: 90px;
                border-radius: 8px;
                object-fit: cover;
            }
        }
    }
    
    .track-info {
        flex: 1;
        min-width: 0;
        
        .track-name {
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.3;
            margin-bottom: 0.25rem;
        }
        
        .artist-name {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 0.25rem;
            color: g.$light;
        }
        
        .album-name {
            font-size: 0.9rem;
            color: g.$border;
            font-style: italic;
        }
    }

    .generic-error {
        font-size: 0.85rem;
        color: g.$border;
        font-style: italic;
    }

    @media (max-width: 480px) {
        .track-info {
            align-self: center;
            text-align: center;
        }
        
        .album-art {
            align-self: center;
            
            img {
                width: 120px;
                height: 120px;
            }
        }
    }
</style>
