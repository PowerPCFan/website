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
                <div class="buyer-protection-card">
                    <!-- <img src="/images/shop/handshake.png" alt="Buyer Protection" /> -->
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M475-160q4 0 8-2t6-4l328-328q12-12 17.5-27t5.5-30q0-16-5.5-30.5T817-607L647-777q-11-12-25.5-17.5T591-800q-15 0-30 5.5T534-777l-11 11 74 75q15 14 22 32t7 38q0 42-28.5 70.5T527-522q-20 0-38.5-7T456-550l-75-74-175 175q-3 3-4.5 6.5T200-435q0 8 6 14.5t14 6.5q4 0 8-2t6-4l136-136 56 56-135 136q-3 3-4.5 6.5T285-350q0 8 6 14t14 6q4 0 8-2t6-4l136-135 56 56-135 136q-3 2-4.5 6t-1.5 8q0 8 6 14t14 6q4 0 7.5-1.5t6.5-4.5l136-135 56 56-136 136q-3 3-4.5 6.5T454-180q0 8 6.5 14t14.5 6Zm-1 80q-37 0-65.5-24.5T375-166q-34-5-57-28t-28-57q-34-5-56.5-28.5T206-336q-38-5-62-33t-24-66q0-20 7.5-38.5T149-506l232-231 131 131q2 3 6 4.5t8 1.5q9 0 15-5.5t6-14.5q0-4-1.5-8t-4.5-6L398-777q-11-12-25.5-17.5T342-800q-15 0-30 5.5T285-777L144-635q-9 9-15 21t-8 24q-2 12 0 24.5t8 23.5l-58 58q-17-23-25-50.5T40-590q2-28 14-54.5T87-692l141-141q24-23 53.5-35t60.5-12q31 0 60.5 12t52.5 35l11 11 11-11q24-23 53.5-35t60.5-12q31 0 60.5 12t52.5 35l169 169q23 23 35 53t12 61q0 31-12 60.5T873-437L545-110q-14 14-32.5 22T474-80Zm-99-560Z"/></svg>
                    <div>
                        <h3>Buyer Protection</h3>
                        <p>Purchasing through Jawa guarantees that you'll receive your item as described, or get your money back.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="description-wrapper">
            <h2>Description</h2>
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
            background-color: gv.$lighter-dark;
            border-radius: 0.5rem;
            align-self: start;

            h2 {
                font-size: 2rem;
                font-weight: 800;
            }
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

            .buyer-protection-card {
                margin-top: 1rem;
                border-radius: 0.5rem;
                background-color: gv.$lighter-dark;
                padding-inline: 1rem;
                display: flex;
                flex-direction: row;
                gap: 1.5rem;

                svg {
                    width: 6rem;
                    height: 6rem;
                }

                div {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    * {
                        margin: 0;
                    }
                }
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
