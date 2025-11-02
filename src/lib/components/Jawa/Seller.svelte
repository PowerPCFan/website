<script lang="ts">
    import type { SellerInfo } from '$lib/types/JawaListing';

    const { seller, displayVerifiedSellerText }: { seller: SellerInfo | null, displayVerifiedSellerText?: boolean } = $props();

    let stars: string | null = $state(null);
    
    $effect(() => {
        const starCount = Number(seller?.reviews?.stars) || 0;
        stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
    });
</script>

<div class="seller-area">
    <div class="seller">
        <div class="seller-pfp">
            <a href={seller?.profile?.url} target="_blank" rel="noopener noreferrer">
                <img src={(seller?.profile?.picture)?.replace('width=64,height=64', 'width=256,height=256')} alt={seller?.profile?.name} class="pfp" />
            </a>
            {#if seller?.profile?.verified}
                <img class="jvs-badge" src="/images/shop/jvs.svg" alt="Jawa Verified Seller" />
            {/if}
        </div>
        <div class="seller-info">
            <div class="seller-name">
                <a href={seller?.profile?.url} target="_blank" rel="noopener noreferrer" class="name">{seller?.profile?.name ?? 'Unknown Seller'}</a>
                {#if displayVerifiedSellerText && seller?.profile?.verified}
                    <p class="jvs-text">Verified Seller</p>
                {/if}
            </div>
            <div class="seller-reviews">
                <a href={seller?.reviews?.url} target="_blank" rel="noopener noreferrer">
                    {seller?.reviews?.stars} <span class="stars">{stars}</span> ({seller?.reviews?.count} Reviews)
                </a>
            </div>
        </div>
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
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1em;

            .seller-pfp {
                position: relative;

                .pfp {
                    border-radius: 50%;
                    width: 6em;
                    height: 6em;
                }

                .jvs-badge {
                    position: absolute;
                    bottom: 0px;
                    right: 0px;
                    width: 1.375em;
                    height: 1.375em;
                }
            }

            .seller-info {
                display: flex;
                flex-direction: column;
                gap: 0.3em;
                align-items: start;

                .seller-name {
                    display: flex;
                    flex-direction: column;

                    * {
                        margin: 0;
                    }

                    .name {
                        font-size: 1.3em;
                        font-weight: 600;
                        color: gv.$light;
                        text-decoration: none;
                    }

                    .jvs-text {
                        font-size: 0.75em;
                        color: gv.$lighter-primary;
                        text-decoration: underline;
                        text-decoration-style: dotted;
                        text-underline-offset: 2px;
                    }
                }

                .seller-reviews {
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
        }
    }
</style>