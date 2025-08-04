<script lang="ts">
    import { getLatestSongVars } from "$lib/utils/lastfm";
    import { onMount } from "svelte";

    let { username } = $props();

    let isLoading: boolean = $state(true);
    let isNowPlaying: boolean | undefined = $state();
    let trackName: string | undefined = $state();
    let trackUrl: string | undefined = $state();
    let artistName: string | undefined = $state();
    let albumName: string | undefined = $state();
    let bestImage: string | undefined = $state();

    onMount(async () => {
        const song = await getLatestSongVars(username);

        isNowPlaying = song.isNowPlaying;
        trackName = song.trackName;
        trackUrl = song.trackUrl;
        artistName = song.artistName;
        albumName = song.albumName;
        bestImage = song.images.best;
        isLoading = false;
    });
</script>

{#if isLoading}
<div class="now-playing-card">
    <div class="card-header">
        <div class="status-indicator loading"></div>
        <h3 class="status-text">Loading last.fm status...</h3>
    </div>
</div>
{:else if trackName && artistName}
<div class="now-playing-card">
    <div class="card-header">
        {#if isNowPlaying}
            <div class="music-bars" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        {:else}
            <div class="status-indicator"></div>
        {/if}
        <h3 class="status-text">
            {isNowPlaying ? 'Now Playing' : 'Last Played'}
        </h3>
    </div>
    
    <div class="card-content">
        {#if bestImage}
        <div class="album-art">
            <img loading="lazy" src={bestImage} onclick={() => window.open(bestImage, '_blank')} alt="Album art for {albumName}" />
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
    </div>
</div>
{/if}

<style lang="scss">
    @use '/static/scss/global.scss' as g;
    
    .now-playing-card {
        background: g.$dark;
        border: 2px solid g.$border;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        max-width: 400px;
    }
    
    .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;

        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: g.$border;
            transition: all 0.3s ease;

            &.loading {
                background: g.$border;
                animation: pulse 1s linear infinite;
            }
        }

        /* Spotify-style music bars */
        .music-bars {
            display: flex;
            align-items: flex-end;
            gap: 3px;
            height: 14px;
            width: 18px;

            span {
                width: 3px;
                height: 100%;
                background: #3be377;
                border-radius: 2px;
                animation: bounce 1s ease-in-out infinite;
                transform-origin: bottom;
            }

            span:nth-child(1) { animation-delay: 0s; }
            span:nth-child(2) { animation-delay: 0.4s; }
            span:nth-child(3) { animation-delay: 0.1s; }
            span:nth-child(4) { animation-delay: 0.7s; }
        }
        
        .status-text {
            margin: 0;
            font-size: 0.9rem;
            font-weight: 600;
            color: g.$border;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }
    
    .card-content {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .album-art {
        flex-shrink: 0;
        
        img {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;

            transition: transform 0.2s ease;

            &:hover {
                cursor: pointer;
                transform: scale(1.05);
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
            
            a {
                color: g.$link;
                text-decoration: none;
                transition: color 0.2s ease;
                
                &:hover {
                    color: lighten(g.$link, 20);
                    text-decoration: underline;
                }
            }
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
    
    @keyframes bounce {
        0%, 100% { transform: scaleY(0.3); }
        50%      { transform: scaleY(1); }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.6;
            transform: scale(1.2);
        }
    }
    
    @media (max-width: 480px) {
        .now-playing-card {
            padding: 1rem;
            max-width: 100%;
        }
        
        .card-content {
            flex-direction: column;
            text-align: center;
        }

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
