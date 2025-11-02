<!-- this was originally human written but it wasnt working well so Google Gemini 2.5 Pro refactored it for me -->

<script lang="ts">
    import { onMount } from 'svelte';

    let { images, autoScroll = false, interval = 5 }: { images: string[]; autoScroll?: boolean; interval?: number; } = $props();

    let currentIndex: number = $state(0);
    let loading: boolean = $state(true);
    let showSpinner: boolean = $state(false);
    let spinnerTimeout: ReturnType<typeof setTimeout>;
    let autoScrollInterval: ReturnType<typeof setInterval>;
    let dotContainer: HTMLDivElement | null = $state(null);
    let carouselWindow: HTMLDivElement | null = $state(null);
    let imageElements: (HTMLImageElement | null)[] = $state([]);
    let zoomImg: HTMLImageElement | null = $state(null);
    let isZoomed: boolean = $state(false);
    let isFocused: boolean = $state(false);
    let touchStart: number | null = null;

    let hasImages: boolean = $state(false);

    $effect(() => {
        hasImages = images.length > 0;
    });

    $effect(() => {
        if (hasImages) {
            zoomImg = imageElements[currentIndex];
        }
    });

    $effect(() => {
        if (autoScroll && hasImages && images.length > 1) {
            autoScrollInterval = setInterval(next, interval * 1000);
        }
        return () => {
            clearInterval(autoScrollInterval);
        };
    });

    $effect(() => {
        if (dotContainer && hasImages) {
            const activeDot = dotContainer.children[currentIndex] as HTMLElement;
            if (activeDot) {
                const containerWidth = dotContainer.offsetWidth;
                const dotLeft = activeDot.offsetLeft;
                const dotWidth = activeDot.offsetWidth;
                const scrollLeft = dotLeft - containerWidth / 2 + dotWidth / 2;
                
                dotContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    });

    function handleTouchStart(e: TouchEvent) {
        touchStart = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e: TouchEvent) {
        if (!touchStart) return;
        
        const touchEnd = e.changedTouches[0].screenX;
        const swipeDistance = touchEnd - touchStart;
        
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) previous();
            else next();
        }
        
        touchStart = null;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!isFocused) return;
        if (event.key === 'ArrowLeft') previous();
        if (event.key === 'ArrowRight') next();
        if (event.key === 'Escape' && isZoomed) toggleZoom();
    }

    function handleFocus() {
        isFocused = true;
    }

    function handleBlur(event: FocusEvent) {
        if (!event.relatedTarget || 
            !(event.relatedTarget instanceof Node) || 
            !carouselWindow?.contains(event.relatedTarget)) {
            isFocused = false;
        }
    }

    function toggleZoom(event?: MouseEvent) {
        if (autoScroll) return;
        if (!isZoomed && event) {
            isZoomed = true;
            handleZoomMove(event);
        } else {
            isZoomed = false;
        }
    }

    function handleZoomMove(event: MouseEvent) {
        if (!isZoomed || !zoomImg || !carouselWindow) return;

        const rect = carouselWindow.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * 100;
        const y = (event.clientY - rect.top) / rect.height * 100;

        zoomImg.style.transformOrigin = `${x}% ${y}%`;
    }

    function next() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function previous() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    function jumpToImage(index: number) {
        currentIndex = index;
    }

    onMount(() => {
        if (hasImages) {
            window.addEventListener('keydown', handleKeydown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

{#if hasImages}
    <div class="carousel-container"
         onfocusin={handleFocus}
         onfocusout={handleBlur}>
        {#if images.length > 1 && !autoScroll}
            <button 
                class="nav-button prev" 
                onclick={previous}
                aria-label="Previous image">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
        {/if}

        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div class="carousel-window"
            bind:this={carouselWindow}
            ontouchstart={handleTouchStart}
            ontouchend={handleTouchEnd}
            onmousemove={handleZoomMove}
            onkeydown={handleKeydown}
            class:zoomed={isZoomed}
            class:auto-scrolling={autoScroll}
            role="region"
            aria-label="Image carousel viewer">
            <div class="slides-container" style:transform="translateX(-{currentIndex * 100}%)">
                {#each images as src, i}
                    <div class="slide" class:active={i === currentIndex}>
                        <button
                            class="image-container"
                            onclick={toggleZoom}
                            onkeydown={(e) => e.key === 'Enter' && toggleZoom()}
                            aria-label={`Zoom ${isZoomed ? 'out of' : 'into'} image ${i + 1} of ${images.length}`}>
                            <img 
                                bind:this={imageElements[i]}
                                {src}
                                alt="Product view {i + 1} of {images.length}"
                                class:zoomed={isZoomed && i === currentIndex}
                                loading="lazy"
                            />
                        </button>
                    </div>
                {/each}
            </div>
        </div>

        {#if images.length > 1 && !autoScroll}
            <button 
                class="nav-button next" 
                onclick={next}
                aria-label="Next image">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        {/if}

        {#if images.length > 1}
            <div class="dot-container" bind:this={dotContainer}>
                {#each images as _, i}
                    <button 
                        class="dot" 
                        class:active={i === currentIndex}
                        class:not-clickable={autoScroll}
                        onclick={() => !autoScroll && jumpToImage(i)}
                        aria-label="Go to image {i + 1}"
                        disabled={autoScroll}
                    ></button>
                {/each}
            </div>
        {/if}
    </div>
{:else}
    <div class="carousel-container">
        <div class="carousel-window">
            <p class="body">No images available</p>
        </div>
    </div>
{/if}

<style lang="scss">
    @use 'sass:color';
    @use '/static/scss/global.scss' as g;

    .carousel-container {
        position: relative;
        width: 90%;
        aspect-ratio: 10 / 7;
        margin: 0 auto;
        padding: 0;
        // border: 1px solid g.$border;
        border-radius: 1rem;
    }

    .carousel-window {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 0;
        box-sizing: border-box;
        cursor: zoom-in;

        &.auto-scrolling {
            cursor: default;
        }

        &.zoomed {
            cursor: zoom-out;
        }
    }

    .slides-container {
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.5s ease-in-out;
    }

    .slide {
        flex: 0 0 100%;
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        border-radius: 1rem;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;

        &.zoomed {
            transform: scale(2.5);
        }
    }

    .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(g.$primary, 0.5);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        transition: background-color 0.1s;
        z-index: 2;

        &:hover {
            background-color: g.$primary;
        }

        &.prev {
            left: 10px;
        }

        &.next {
            right: 10px;
        }

        i {
            font-size: 1.2rem;
        }
    }

    .dot-container {
        $dotContainerColor: rgba(84, 84, 84, 0.5);
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 20px;
        padding: 8px 20px;
        overflow-x: auto;
        width: 150px;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
        background-color: $dotContainerColor;
        border-radius: 20px;

        &:has(.dot:nth-child(-n+5):last-child) {
            justify-content: center;
        }
        
        &::-webkit-scrollbar {
            display: none;
        }

        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 20px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        }

        &:not(:has(.dot:nth-child(-n+5):last-child)) {
            &::before,
            &::after {
                opacity: 1;
            }
        }

        &::before {
            left: 0;
            background: linear-gradient(to right, $dotContainerColor, transparent);
            border-radius: 20px 0 0 20px;
        }

        &::after {
            right: 0;
            background: linear-gradient(to left, $dotContainerColor, transparent);
            border-radius: 0 20px 20px 0;
        }
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        border: none;
        padding: 0;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;

        &.not-clickable {
            cursor: default;
        }

        &:hover {
            background-color: white;
            transform: scale(1.2);
        }

        &.active {
            background-color: white;
            transform: scale(1.2);
        }
    }

    .image-container {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        &:focus {
            outline: 2px solid g.$primary;
            outline-offset: 2px;
        }

        &:focus:not(:focus-visible) {
            outline: none;
        }
    }
</style>
