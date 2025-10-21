<script lang="ts">
    import Title from '$lib/components/title.svelte';
    import galleryData from '$lib/data/gallery.json';

    const images = galleryData.images;
</script>

<Title title="Photography Gallery" />

<div class="gallery-container">
    <h1>Photography Gallery</h1>
    <div class="gallery-grid">
        {#each images as image}
            <div class="gallery-item">
                <a href="/photography-gallery/view-image/{image.id}">
                    <img loading="lazy" src="/images/gallery/{image.id}-thumbnail.webp" alt="{image.metadata.title}" />

                    <div class="item-info">
                        <p class="title">{image.metadata.title}</p>
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as gv;

    .gallery-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        gap: 1rem;

        h1 {
            font-size: 2.5rem;
        }

        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
            width: 100%;
            max-width: 80vw;

            .gallery-item {
                width: 100%;
                // aspect-ratio: 5 / 4;
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
                    // width: 100%;
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
        }
    }
</style>
