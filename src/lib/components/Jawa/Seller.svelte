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
                <svg class="jvs-badge" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="m340.65-49.72-77.67-131.35-147.83-32.71 14.48-151.59L29.48-480l100.15-114.63-14.48-151.59 147.83-32.71 77.67-131.35L480-850.85l139.35-59.43 77.67 131.35 147.83 32.71-14.48 151.59L930.52-480 830.37-365.37l14.48 151.59-147.83 32.71-77.67 131.35L480-109.15 340.65-49.72ZM438-335.37 666.63-564l-58.87-60.39L438-454.63l-85.76-84.24L293.37-480 438-335.37Z" />
                </svg>
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
                    {seller?.reviews?.stars} <span class="stars">{stars}</span> <span class="underline">(View {seller?.reviews?.count} Reviews)</span>
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
                    width: 1.6em;
                    height: 1.6em;
                    fill: gv.$light;
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
                        font-size: 0.9em;
                        font-weight: 600;
                        color: gv.$light;
                        text-decoration: none;

                        .underline {
                            opacity: 0.8;
                            font-size: inherit;
                        }

                        &:hover {
                            .underline {
                                text-decoration: underline;
                                text-underline-offset: 2px;
                            }
                        }

                        .stars {
                            color: gv.$yellow;
                        }
                    }
                }
            }
        }
    }
</style>