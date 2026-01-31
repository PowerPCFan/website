<script lang="ts">
    import Title from '$lib/components/title.svelte';
    import type { Songs } from '$lib/types/song';
    import favoriteSongs from '$lib/data/songs.json';

    const songs = favoriteSongs.songs as Songs;
</script>

<Title title="Favorite Songs" />

{#snippet song(id: string, title: string, thumbnail: string)}
    <div class="song">
        <a href="/music/songs/song/{id}">
            <img loading="lazy" src={thumbnail} alt={title} />

            <div class="item-info">
                <p class="title">{title}</p>
            </div>
        </a>
    </div>
{/snippet}

<div class="song-container">
    <h1>Song Lyrics/Reviews</h1>

    <div class="song-grid">
        {#each songs as s}
            {@render song(s.id, s.metadata.title, s.images.thumbnail)}
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
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
        position: relative;

        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.02);
        }

        a {
            display: block;
            width: 100%;
            // height: 100%;
            margin: 0;
            padding: 0;
            text-decoration: none;

            img {
                width: 100%;
                // height: 100%;
                // object-fit: cover;
                display: block;
                border-radius: 0;
                // transition: transform 0.3s ease;

                // &:hover {
                //     transform: scale(1.1);
                // }
            }
        }

        .item-info {
            width: 100%;
            padding-inline: 1rem;
            margin-block: 0.75rem;

            .title {
                font-weight: bold;
                color: gv.$dark;
                margin-block: 0;
                font-size: 1rem;
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
