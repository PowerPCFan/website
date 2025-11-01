<script lang="ts">
    import type { JawaListing } from '$lib/types/JawaListing';
    import Seller from '$lib/components/Jawa/Seller.svelte';
    import { onMount } from 'svelte';
    import Title from '$lib/components/title.svelte';

    const listingsUrl = "https://raw.githubusercontent.com/PowerPCFan/shop/refs/heads/main/output/listings.json";
    let listings: JawaListing[] | null = $state(null);

    onMount(async () => {
        const response = await fetch(listingsUrl);
        listings = await response.json();
    });
</script>

<Title title="Shop Charlie's Computers" />

<div class="page-container">
    <div style="font-size: 1.5rem;">
        <Seller listing={listings?.[0] ?? null} displayVerifiedSellerText />
    </div>

    <div class="listings-grid">
        {#each (listings ?? []) as listing}
            <a class="listing-card" href="/shop/{listing.metadata.uuid}">
                <div class="image-container">
                    <img src="{listing.media.thumbnail_url}" alt="{listing.metadata.title}" />
                </div>
                <div class="info-container">
                    <div class="title">{listing.metadata.title}</div>
                    {#if !listing.status.sold_out}
                        <div class="price">{listing.status.price}</div>
                    {:else}
                        <div class="price sold-out"><em>Sold Out</em></div>
                    {/if}
                </div>
            </a>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    .page-container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 2rem;
        background-color: g.$dark;
        color: g.$light;
    }

    .listings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 2rem;
        margin-top: 2rem;

        .listing-card {
            display: flex;
            flex-direction: column;
            background-color: #252525;
            padding: 1rem;
            text-decoration: none;
            border-radius: 1rem;
            gap: 0.5rem;

            .image-container {
                img {
                    width: 100%;
                    border-radius: 1rem;
                }
            }

            .info-container {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;

                .title, .price {
                    text-align: left;
                    border-radius: 0.5rem;
                    padding-block: 0.3rem;
                    font-weight: bold;
                    font-size: 1rem;
                    color: g.$light;
                }

                .title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .price {
                    color: lighten(g.$primary, 10%);
                }
            }
        }
    }
</style>
