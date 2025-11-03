<script lang="ts">
    import type { JawaListing, SellerInfo, JawaSellerData } from '$lib/types/JawaListing';
    import Seller from '$lib/components/Jawa/Seller.svelte';
    import { onMount } from 'svelte';
    import Title from '$lib/components/title.svelte';
    import ImageCarousel from '$lib/components/ImageCarousel.svelte';

    const sellerDataUrl = "https://raw.githubusercontent.com/PowerPCFan/shop/refs/heads/main/output/listings.json" + `?cacheBuster=${Date.now().toString()}`;
    let sellerData: JawaSellerData | null = $state(null);
    let listings: JawaListing[] | null = $state(null);

    onMount(async () => {
        const response = await fetch(sellerDataUrl);
        sellerData = await response.json();
        listings = sellerData?.listings ?? null;
    });
</script>

<Title title="Shop Charlie's Computers" />

<div class="page-container">
    <div class="top-banner">
        <div class="seller-card">
            <Seller seller={sellerData?.seller_info ?? null} displayVerifiedSellerText />
            <h2 class="heading">{sellerData?.seller_info.heading}</h2>
            <p class="seller-stats">
                <span class="bold">{sellerData?.seller_info.profile.followers}</span> followers • 
                <span class="bold">{sellerData?.seller_info.profile.sold}</span> listings sold
            </p>
            <div class="buttons">
                <button onclick={() => window.open(sellerData?.seller_info.profile.url, '_blank')}>
                    Message (via Jawa)
                </button>
                <button class="even" onclick={() => window.open(sellerData?.seller_info.profile.url, '_blank')}>
                    Follow (via Jawa)
                </button>
            </div>
        </div>
        <div class="image-swiper">
            <ImageCarousel images={sellerData?.seller_info?.images ?? []} autoScroll={true} />
        </div>
    </div>

    <br />
    <br />
    <hr />
    <br />

    <div class="listings-grid">
        {#each (listings ?? []) as listing}
            <a class="listing-card" href="/shop/{listing.metadata.uuid}">
                <div class="image-container">
                    <img src="{listing.media.thumbnail_url}" alt="{listing.metadata.title}" />
                    {#if listing.status.sold_out}
                        <div class="sold-out-overlay"><span>SOLD OUT</span></div>
                    {/if}
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

    .top-banner {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-inline: 2rem;
        gap: 1rem;

        .seller-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            font-size: 1.15rem;
            width: 50%;
            flex: 1;

            .heading {
                margin: 0;
                font-size: 2.2rem;
                font-weight: 800;
            }

            .seller-stats {
                margin: 0;
                font-size: 1.1rem;
                font-weight: normal;

                .bold {
                    font-weight: bold;
                }
            }

            .buttons {
                display: flex;
                flex-direction: row;
                gap: 0.75rem;

                button {
                    font-size: 1rem;
                    font-family: g.$stack;
                    background-color: g.$primary;
                    color: g.$light;
                    border: none;
                    border-radius: 1rem;
                    padding-block: 0.5rem;
                    padding-inline: 1.5rem;
                    cursor: pointer;

                    transition: background-color 0.2s ease;

                    &:hover {
                        background-color: lighten(g.$primary, 10%);
                    }

                    &.even {
                        background-color: rgba(255,255,255,0);
                        border: 2px solid g.$primary;
                        color: g.$primary;

                        &:hover {
                            background-color: rgba(255,255,255,0.125);
                        }
                    }
                }
            }
        }

        .image-swiper {
            width: 50%;
            flex: 1;
        }
    }

    .listings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(375px, 1fr));
        gap: 2rem;
        margin-top: 2rem;

        .listing-card {
            display: flex;
            flex-direction: column;
            background-color: #252525;
            padding: 0.75rem;
            text-decoration: none;
            border-radius: 1rem;
            gap: 0.5rem;

            .image-container {
                position: relative;

                img {
                    width: 100%;
                    border-radius: 0.75rem;
                }

                .sold-out-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-15deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;

                    span {
                        color: g.$light;
                        opacity: 0.9;
                        font-size: 4rem;
                        font-weight: bold;
                        text-wrap: nowrap;
                    }
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

    @media (max-width: 1024px) {
        .top-banner {
            flex-direction: column;
            padding-inline: 1.25rem;

            .seller-card, .image-swiper {
                width: 100%;
            }
        }

        .listings-grid {
            grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
        }
    }

    @media (max-width: 450px) {
        .top-banner {
            padding-inline: 0.5rem;
            .seller-card {
                .heading {
                    font-size: 1.75rem;
                }
            }
        }

        .listings-grid {
            grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
        }
    }
</style>
