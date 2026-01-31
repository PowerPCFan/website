<script lang="ts">
    import Title from '$lib/components/title.svelte';
    import type { Songs, NameURLComboWithYear } from '$lib/types/song';
    import favoriteSongs from '$lib/data/songs.json';

    const songs = favoriteSongs.songs as Songs;
</script>

<Title title="Favorite Songs" />

{#snippet song(
    id: string,
    title: string,
    artist: string,
    album: NameURLComboWithYear,
    thumbnail: string
)}
    <div class="song">
        <a href="/music/songs/song/{id}">
            <img loading="lazy" src={thumbnail} alt={title} />

            <div class="item-info">
                <p class="title">{title}</p>
                <p class="artist"><span class="by">by</span> {artist}</p>
                <p class="album"><span class="on">on</span> <span class="italic">{album.name}</span> ({album.year})</p>
            </div>
        </a>
    </div>
{/snippet}

<div class="song-container">
    <h1>Song Lyrics/Reviews</h1>

    <div class="song-grid">
        {#each songs as s}
            {@render song(
                s.id,
                s.metadata.title,
                s.metadata.artist.name,
                s.metadata.album,
                s.images.thumbnail
            )}
        {/each}
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as gv;

    .song-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        gap: 1rem;

        h1 {
            font-size: 2.5rem;
            text-align: center;
        }

        .song-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
            gap: 25px;
            width: 100%;
            max-width: 80vw;
        }
    }

    .song {
        width: 100%;
        background: gv.$light;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // position: relative;

        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.02);
        }

        a {
            display: block;
            width: 100%;
            margin: 0;
            padding: 0;
            text-decoration: none;

            img {
                width: 100%;
                aspect-ratio: 1 / 1;
                object-fit: cover;
                display: block;
                border-radius: 0;
            }
        }

        .item-info {
            width: 100%;
            padding-inline: 1rem;
            margin-block: 0.75rem;

            .title {
                font-weight: 800;
                color: gv.$dark;
                margin-block: 0;
                font-size: 1rem;
            }

            .artist {
                font-weight: 500;
                color: gv.$lighter-dark;
                margin-block: 0;
                font-size: 0.9rem;

                .by {
                    font-weight: 300;
                }
            }

            .album {
                font-weight: 500;
                color: gv.$lighter-dark;
                margin-block: 0;
                font-size: 0.9rem;

                .italic {
                    font-style: italic;
                }

                .on {
                    font-style: normal;
                    font-weight: 300;
                }
            }
        }
    }

    @media (max-width: 600px) {
        .song-container {
            padding: 1rem;

            .song-grid {
                grid-template-columns: 1fr;
                max-width: 100%;
            }
        }
    }
</style>
