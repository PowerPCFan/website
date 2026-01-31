<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import type { Song } from '$lib/types/song';

    // @ts-ignore
    import { marked } from "marked";
    // @ts-ignore
    import DOMPurify from 'dompurify';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';

    let songData: Song | null = $state(null);
    let loading = $state(true);
    let error = $state("");
    let normalLyrics = $state("");
    let translatedLyrics = $state("");
    let lyrics = $state("");
    let normalLyricsShowing = $state(true);
    let review: string | null = $state(null);

    onMount(async () => {
        const songId = page.params.id || "";

        if (!songId) {
            error = 'No song ID specified';
            loading = false;
            return;
        }

        try {
            const response = await fetch(`/api/music/songs/song?id=${songId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch song data');
            }

            songData = data.song as Song;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load song';
        } finally {
            loading = false;
        }

        normalLyrics = DOMPurify.sanitize(await marked.parse(songData?.lyrics.content ?? 'Error loading lyrics.'));
        translatedLyrics = DOMPurify.sanitize(await marked.parse(songData?.lyrics.translatedContent ?? 'Error loading translated lyrics.'));
        lyrics = normalLyrics;
        normalLyricsShowing = true;
        if (songData?.review) {
            review = DOMPurify.sanitize(await marked.parse(songData?.review.content ?? 'Error loading review.'));
        }
    });

    function toggleTranslatedLyrics() {
        normalLyricsShowing = !normalLyricsShowing;
        lyrics = normalLyricsShowing ? normalLyrics : translatedLyrics;
    }
</script>

<div class="main-container" style="--album-cover-url: url('{songData?.images.full}')">
    <div class="song-page">
        {#if loading}
            <div class="loading">Loading...</div>
        {:else if error}
            <div class="error">Error: {error}</div>
        {:else if songData}
            <div class="song-info glassy">
                <div class="album-cover">
                    <img src={songData.images.full} alt="Album cover for {songData.metadata.album.name}" />
                </div>
                <div class="details">
                    <h1 class="song-title"><a class="less-hints" href={songData.metadata.url}>{songData.metadata.title}</a></h1>
                    <p class="artist">by <a href={songData.metadata.artist.url} target="_blank">{songData.metadata.artist.name}</a></p>
                    <p class="album">on <a class="italic" href={songData.metadata.album.url} target="_blank">{songData.metadata.album.name}</a> ({songData.metadata.album.year})</p>
                </div>
            </div>
            <div class="content-wrapper">
                <div class="song-lyrics glassy">
                    <h2>Lyrics</h2>
                    {#if songData?.lyrics.translatedContent}
                        <LanguageToggle
                          normalLyricsShowing={normalLyricsShowing}
                          toggleTranslatedLyrics={toggleTranslatedLyrics}
                          originalLanguage={songData?.lyrics.originalLanguage}
                          translatedLanguage={songData?.lyrics.translatedLanguage}
                        />
                    {/if}
                    <div class="lyrics-container">
                        <div class="lyrics-wrapper">
                            {@html lyrics}
                        </div>
                        {#if normalLyricsShowing}
                            <p class="source">Lyrics source: <a href={songData.lyrics.sourceUrl} target="_blank">{songData.lyrics.sourceName}</a></p>
                            <p class="written-by">Writer: {songData.lyrics.writtenBy}</p>
                        {/if}
                    </div>
                </div>
                {#if songData?.review}
                    <div class="song-review glassy">
                        <h2>My Review</h2>
                        <p><strong>Rating:</strong> {songData.review.rating}/10</p>
                        <div class="review">
                            {@html review}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .song-lyrics, .song-review {
        h2 {
            margin-top: 0.2rem;
            margin-bottom: 0.5rem;
            text-align: center;
        }
    }

    .song-lyrics .lyrics-container .lyrics-wrapper {
        line-height: 1.25;
    }

    .song-review .review {
        line-height: 1.5;
    }

    .source, .written-by {
        margin-block: 0;
        font-size: 0.9rem;
        color: lightgray;
    }

    .italic {
        font-style: italic;
    }

    .glassy {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(12px);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        color: g.$light;

        h2 {
            margin-bottom: 1rem;
        }

        div {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    }

    .main-container {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--album-cover-url) no-repeat center center/cover;
            filter: blur(8px) brightness(0.3);
            z-index: -1;
        }

        a {
            font-size: inherit;
            color: lighten(g.$link, 10%);

            &:hover {
                text-decoration: underline;
                text-underline-offset: 2px;
                cursor: pointer;
            }
        }

        a.less-hints {
            // links with less-hints look like normal text until you hover
            color: inherit;
        }
    }

    .song-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        gap: 1rem;
        position: relative;
        overflow: hidden;
        height: 100%;
        margin: 0;
        width: 100%;
        max-width: 1000px;

        .song-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1.5rem;
            width: 100%;

            .album-cover {
                flex-shrink: 0;

                img {
                    max-width: 200px;
                    width: 35vw;
                    min-width: 100px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    // crop to 1:1 without stretching
                    aspect-ratio: 1 / 1;
                    object-fit: cover;
                }
            }

            .details {
                flex-grow: 1;
                color: g.$light;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                h1, p {
                    margin: 0;
                }

                .song-title {
                    font-size: 2rem;
                    font-weight: bold;
                }

                .artist {
                    font-size: 1.2rem;
                }

                .album {
                    font-size: 1.1rem;
                }
            }
        }

        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;

            @media (min-width: 768px) {
                flex-direction: row;
            }

            & > * {
                flex: 1;
            }
        }

        .loading, .error {
            font-size: 1.5rem;
            color: g.$light;
        }
    }

    @media (max-width: 1024px) {
        .song-page {
            max-width: 98vw;
            padding: 1rem;
        }
    }

    @media (max-width: 768px) {
        .song-page {
            max-width: 100vw;
            padding: 0.5rem;
        }
        .song-info {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }
        .song-info .album-cover img {
            max-width: 80vw;
            min-width: 0;
        }
        .content-wrapper {
            flex-direction: column !important;
        }
    }

    @media (max-width: 480px) {
        .song-page {
            padding: 0.25rem;
        }
        .song-info .details .song-title {
            font-size: 1.2rem;
        }
        .song-info .details .artist,
        .song-info .details .album {
            font-size: 1rem;
        }
        .song-info .album-cover img {
            max-width: 95vw;
        }
        .glassy {
            padding: 0.5rem;
        }
    }

    :global(.chorus), :global(.verse) {
        color: g.$darker-light;
        margin-top: 1.25rem;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }
</style>
