<script lang="ts">
    import { onMount } from 'svelte';
    import type { JawaListing } from '$lib/types/JawaListing';

    const { listing, displayVerifiedSellerText }: { listing: JawaListing | null, displayVerifiedSellerText?: boolean } = $props();

    let stars: string | null = $state(null);

    onMount(() => {
        stars = '★'.repeat(listing?.seller.reviews.stars ?? 0) + '☆'.repeat(5 - (listing?.seller.reviews.stars ?? 0));
    });
</script>

<div class="seller-area">
    <div class="seller">
        <a href={listing?.seller.profile_url} target="_blank" rel="noopener noreferrer">
            <div class="seller-pfp">
                <img src={listing?.seller.pfp} alt={listing?.seller.name} width="64" height="64" style="border-radius: 50%;" />
                {#if listing?.seller.verified}
                    <img src="/images/shop/jvs.svg" alt="Jawa Verified Seller" />
                {/if}
            </div>
            <div class="seller-name">
                <p class="name">{listing?.seller.name ?? 'Unknown Seller'}</p>
                {#if displayVerifiedSellerText && listing?.seller.verified}
                    <p class="jvs-text">Verified Seller</p>
                {/if}
            </div>
        </a>
    </div>
    <div class="reviews">
        <a href={listing?.seller.reviews.url} target="_blank" rel="noopener noreferrer">
            {listing?.seller.reviews.stars} <span class="stars">{stars}</span> ({listing?.seller.reviews.count} Reviews)
        </a>
    </div>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as gv;


    .seller-area {
        // margin-top: 2em;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        gap: 0.5em;

        .seller {
            // display: flex;
            // flex-direction: row;
            // align-items: center;
            // gap: 1em;

            a {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1em;
                text-decoration: none;
                color: gv.$light;
            }

            .seller-pfp {
                position: relative;

                img:nth-child(2) {
                    position: absolute;
                    bottom: 0px;
                    right: 0px;
                    width: 22px;
                    height: 22px;
                }
            }

            .seller-name {
                display: flex;
                flex-direction: column;

                * {
                    margin: 0;
                }

                .name {
                    font-size: 1.3em;
                    font-weight: 600;
                }

                .jvs-text {
                    font-size: 0.75em;
                    color: gv.$lighter-primary;
                    text-decoration: underline;
                    text-decoration-style: dotted;
                    text-underline-offset: 2px;
                }
            }
        }

        .reviews {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 1em;

            a {
                font-size: 1.1em;
                font-weight: 600;
                color: gv.$light;

                .stars {
                    color: gv.$yellow;
                }
            }
        }
    }
</style>