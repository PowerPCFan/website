<!-- NOTE: -->
<!-- This file was human written except for the pan/zoom code which was partially AI generated -->
<!-- not ideal but i couldn't figure out a good solution on my own that worked as good as this -->
<!-- i tried to get mobile pan/zoom working as well but nothing that I tried or Claude Sonnet 4 tried worked well enough for me to use it -->


<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import type { JawaListing, SellerInfo, JawaSellerData } from '$lib/types/JawaListing';
    import Title from '$lib/components/title.svelte';
    import ImageCarousel from '$lib/components/ImageCarousel.svelte';
    import Seller from '$lib/components/Jawa/Seller.svelte';

    // @ts-ignore
    import { marked } from "marked";
    // @ts-ignore
    import DOMPurify from 'dompurify';

    const sellerDataUrl = "https://raw.githubusercontent.com/PowerPCFan/shop/refs/heads/main/output/listings.json" + `?cacheBuster=${Date.now().toString()}`;
    let sellerData: JawaSellerData | null = $state(null);
    let listings: JawaListing[] | null = $state(null);
    let listing: JawaListing | null = $state(null);

    let loading = $state(true);
    let error = $state('');

    let htmlDescription: unknown | null = $state(null);

    onMount(async () => {
        try {
            const response = await fetch(sellerDataUrl);
            sellerData = await response.json();
            listings = sellerData?.listings ?? null;

            const listingUuid = page?.params?.uuid;
            listing = listings?.find(item => item.metadata.uuid === listingUuid) || null;
        } catch (err) {
            error = 'Failed to load listing.';
            console.error(err);
        } finally {
            loading = false;
        }

        htmlDescription = DOMPurify.sanitize(await marked.parse(listing?.details.description ?? 'Error loading description.'));
    });
</script>

<Title title={listing?.metadata?.title || "Listing"} />

<div class="page-container">
    {#if loading}
        <div class="loading">Loading...</div>
    {:else if error}
        <div class="error">Error: {error}</div>
    {:else if listing}
        <div class="back-navigation">
            <a href="/shop" class="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -960 960 960" fill="#e3e3e3">
                    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                </svg>
                Back
            </a>
        </div>

        <div class="image-and-info-wrapper">
            <div class="image-container">
                {#if listing.media.images.length > 0}
                    <ImageCarousel images={listing.media.images} />
                {/if}
            </div>

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="info-container">
                <h2 id="title">{listing.metadata.title}</h2>
                {#if !listing.status.sold_out}
                    <p id="price">{listing.status.price}</p>
                    <p id="shipping">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M280-160q-50 0-85-35t-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35Zm357-280h193l4-21-74-99h-95l-28 120Zm-19-273 2-7-84 360 2-7 34-146 46-200ZM20-427l20-80h220l-20 80H20Zm80-146 20-80h260l-20 80H100Zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z"/>
                        </svg>

                        Shipping: {listing.status.shipping_cost}
                    </p>
                    <button id="buy-button" onclick={() => window.open(listing?.metadata.url, '_blank')}>Buy It on Jawa</button>
                {:else}
                    <p id="sold-out">Sold Out</p>
                {/if}
                <br />
                <Seller seller={sellerData?.seller_info ?? null} displayVerifiedSellerText />
            </div>
        </div>
        <div class="description-wrapper">
            <h2 style="font-size: 2rem; font-weight: 800;">Description</h2>
            {@html htmlDescription}
        </div>
    {:else}
        <div class="loading">Listing not found.</div>
    {/if}
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as gv;

    $backgroundBlur: 32px;
    $backgroundBrightness: 0.75;

    .page-container {
        height: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 1.2rem;
        gap: 1.2rem;
        min-height: fit-content;
        box-sizing: border-box;
        overflow: hidden;

        .back-navigation {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            margin-bottom: 1rem;

            .back-button {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: gv.$light;
                text-decoration: none;
                padding: 0.75rem 1.2rem;
                border-radius: 8px;
                font-weight: 500;
                font-size: 1rem;

                svg {
                    transition: transform 0.2s ease;
                }

                &:hover {
                    svg {
                        transform: translateX(-3px);
                    }
                }
            }
        }

        .image-and-info-wrapper {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            justify-content: center;
            gap: 1rem;
            width: 100%;
            max-width: 1800px;
            // height: 70vh;
        }

        .description-wrapper {
            width: 100%;
            padding-inline: 1rem;
        }

        .loading {
            text-align: center;
            font-size: 1.2rem;
            color: gv.$light;
            padding: 2rem;
        }

        .error {
            text-align: center;
            font-size: 1.2rem;
            color: #ff6b6b;
            padding: 2rem;
            background-color: rgba(255, 107, 107, 0.1);
            border-radius: 8px;
        }

        .image-container {
            padding: 1rem;
            border-radius: 8px;
            max-width: 65%;
            max-height: 70vh;
            display: flex;
            align-items: start;
            justify-content: center;
            flex: 1.6;
        }

        .info-container {
            flex: 1.4;
            min-width: 300px;
            max-width: 40%;
            padding: 1rem;
            border-radius: 8px;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;

            #title {
                font-size: 2rem;
                font-weight: 800;
            }

            #price {
                font-size: 1.5rem;
                font-weight: 700;
                margin: 0;
                margin-bottom: 0.25rem;

                color: gv.$lighter-primary;
            }

            #shipping {
                font-size: 1rem;
                margin: 0;

                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.5rem;

                color: darken(gv.$light, 15%);

                svg {
                    fill: darken(gv.$light, 15%);
                    width: 1.25rem;
                    height: 1.25rem;
                }
            }

            #buy-button {
                margin-top: 1.25rem;

                border-radius: 1rem;

                padding-block: 0.75rem;

                font-size: 1.25rem;

                cursor: pointer;

                background-color: gv.$primary;
                color: gv.$light;
                border: none;

                width: 100%;

                transition: background-color 0.2s ease, color 0.2s ease;

                font-family: gv.$stack;

                &:hover {
                    background-color: gv.$lighter-primary;
                    color: gv.$dark;
                }
            }

            #sold-out {
                color: gv.$red;
                font-weight: 600;
                font-size: 1.25rem;
            }
        }
    }

    @media (max-width: 800px) {
        .page-container {
            padding: 1rem;
            max-height: 100vh;
            overflow-y: auto;

            .back-navigation {
                margin-bottom: 0;

                .back-button {
                    padding: 0.6rem 1rem;
                    font-size: 0.95rem;
                }
            }
            
            .image-and-info-wrapper {
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                height: auto;
                max-width: 100%;
            }

            .image-container {
                max-width: 100%;
                width: 100%;
                max-height: 60vh;
                flex: none;
                padding: 0.8rem;
                overflow: hidden;
            }

            .info-container {
                min-width: 0;
                max-width: 100%;
                width: 100%;
                flex: none;
                padding: 1.5rem;
                align-items: center;
                text-align: center;
            }
        }
    }

    @media (max-width: 480px) {
        .page-container {
            padding: 0.8rem;

            .image-container {
                max-height: 50vh;
                width: 100%;
                padding: 0.5rem;
            }

            .info-container {
                padding: 1rem;
                gap: 1rem;
            }
        }
    }
</style>
