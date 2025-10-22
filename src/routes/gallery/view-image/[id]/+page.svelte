<!-- NOTE: -->
<!-- This file was human written except for the pan/zoom code which was partially AI generated -->
<!-- not ideal but i couldn't figure out a good solution on my own that worked as good as this -->
<!-- i tried to get mobile pan/zoom working as well but nothing that I tried or Claude Sonnet 4 tried worked well enough for me to use it -->


<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { page } from '$app/state';
    import type { GalleryImage } from '$lib/types/image.ts';
    import Title from '$lib/components/title.svelte';

    let imageData: GalleryImage | null = $state(null);
    let loading = $state(true);
    let error = $state('');

    let imagePopupShouldShow = $state(false);
    let popupImageZoomed = $state(false);
    let popupContainer: HTMLDivElement | null = $state(null);
    let zoomImg: HTMLImageElement | null = $state(null);

    // function createDateString(iso8601: string): string {
    //     const d = new Date(iso8601);
    //     const dt = d.toLocaleString("en-US", {
    //         year: "numeric",
    //         month: "long",
    //         day: "numeric",
    //         hour: "numeric",
    //         minute: "2-digit",
    //         hour12: true
    //     });
    //     const offset = -d.getTimezoneOffset();
    //     const hr = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    //     const min = String(Math.abs(offset) % 60).padStart(2, "0");

    //     return `${dt} (UTC${offset >= 0 ? "+" : "-"}${hr}:${min})`;
    // }

    function createDateString(iso8601: string): string {
        const [datePart, timePart] = iso8601.split("T");

        const [year, _month, day] = datePart.split("-").map(Number);

        const monthMap: Record<number, string> = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        };

        const month = monthMap[_month];

        const [time, _offset] = timePart.includes("+") ? timePart.split("+") : timePart.split("-");
        const offset = (timePart.includes("+") ? "+" : "-") + _offset;

        const [_hour, minute, second] = time.split(":");

        const amPmMap: Record<string, Array<string>> = {
            "00": ["12", "AM"],
            "01": ["1", "AM"],
            "02": ["2", "AM"],
            "03": ["3", "AM"],
            "04": ["4", "AM"],
            "05": ["5", "AM"],
            "06": ["6", "AM"],
            "07": ["7", "AM"],
            "08": ["8", "AM"],
            "09": ["9", "AM"],
            "10": ["10", "AM"],
            "11": ["11", "AM"],
            "12": ["12", "PM"],
            "13": ["1", "PM"],
            "14": ["2", "PM"],
            "15": ["3", "PM"],
            "16": ["4", "PM"],
            "17": ["5", "PM"],
            "18": ["6", "PM"],
            "19": ["7", "PM"],
            "20": ["8", "PM"],
            "21": ["9", "PM"],
            "22": ["10", "PM"],
            "23": ["11", "PM"]
        };

        const hour = amPmMap[_hour];

        return `${month} ${day}, ${year} at ${hour[0]}:${minute} ${hour[1]} (UTC${offset})`;
    }

    async function showImagePopup() {
        imagePopupShouldShow = true;
        await tick();
        popupContainer?.focus();
    }

    function hideImagePopup() {
        imagePopupShouldShow = false;
        popupImageZoomed = false;
    }

    function toggleImagePopup() {
        imagePopupShouldShow = !imagePopupShouldShow;
    }

    function toggleZoom(event?: MouseEvent) {
        if (!popupImageZoomed && event) {
            popupImageZoomed = true;
            handleZoomMove(event);
        } else {
            popupImageZoomed = false;
        }
    }

    function handleZoomMove(event: MouseEvent) {
        if (!popupImageZoomed || !zoomImg || !popupContainer) return;

        const rect = popupContainer.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * 100;
        const y = (event.clientY - rect.top) / rect.height * 100;

        zoomImg.style.transformOrigin = `${x}% ${y}%`;
    }

    onMount(async () => {
        const imageId = page.params.id || "";

        if (!imageId) {
            error = 'No image ID specified';
            loading = false;
            return;
        }

        try {
            const response = await fetch(`/api/gallery/view-image?id=${imageId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load image');
            }

            imageData = (data.image as GalleryImage);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load image';
        } finally {
            loading = false;
        }
    });
</script>

<Title title={imageData ? imageData.metadata.title : "Image Viewer"} />

<div class="page-container">
    {#if loading}
        <div class="loading">Loading...</div>
    {:else if error}
        <div class="error">Error: {error}</div>
    {:else if imageData}
        <div class="back-navigation">
            <a href="/gallery" class="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -960 960 960" fill="#e3e3e3">
                    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                </svg>
                Back
            </a>
        </div>
        <div class="content-wrapper">
            <div class="image-container" id="image-container">
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <img onclick={showImagePopup} loading="lazy" src={imageData.fullImageUrl} alt={imageData.metadata.title || 'Photo'} />
            </div>
            <div class="info-container" id="info-container">
                <h2 id="title">{imageData.metadata.title}</h2>
                <!-- <p id="date">{new Date(imageData.metadata.date).toLocaleString()}</p> -->
                <p id="date">Taken on {createDateString(imageData.metadata.date)}</p>
                <!-- <p>Taken with {startsWithVowel(imageData.metadata.device) ? 'an' : 'a'} {imageData.metadata.device}</p> -->
                <div id="idk">
                    <p id="device">Device: {imageData.metadata.device}</p>
                    <p id="location">Location: {imageData.metadata.location}</p>
                </div>
            </div>
        </div>
        {#if imagePopupShouldShow}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div id="popup-container" bind:this={popupContainer} onclick={hideImagePopup} onmousemove={handleZoomMove} onkeydown={(event) => { if (event.key === 'Escape') hideImagePopup() } } tabindex="0">
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button id="close-button-container" onclick={hideImagePopup}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                    </svg>
                </button>

                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <img bind:this={zoomImg} class:zoom={popupImageZoomed} onclick={(e: MouseEvent) => { e.stopPropagation(); toggleZoom(e) }} loading="lazy" src={imageData.fullImageUrl} alt={imageData.metadata.title || 'Photo'} />
            </div>
        {/if}
    {/if}
</div>



<style lang="scss">
    @use '/static/scss/global.scss' as gv;

    .page-container {
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 1.2rem;
        gap: 1.2rem;
        // min-height: 100vh;
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
                background-color: rgba(255, 255, 255, 0.1);
                transition: background-color 0.2s ease;

                svg {
                    transition: transform 0.2s ease;
                }

                &:hover {
                    background-color: rgba(255, 255, 255, 0.15);

                    svg {
                        transform: translateX(-3px);
                    }
                }
            }
        }

        .content-wrapper {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            justify-content: center;
            gap: 1rem;
            width: 100%;
            max-width: 1400px;
            height: 70vh;
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
            background-color: rgba(255, 255, 255, 0.03);
            padding: 1rem;
            border-radius: 8px;
            max-width: 65%;
            max-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1.6;

            img {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                border-radius: 6px;
                object-fit: contain;
                cursor: pointer;
            }
        }

        .info-container {
            flex: 1.4;
            min-width: 300px;
            max-width: 40%;
            padding: 2rem;
            border: 2px solid rgba(61, 116, 255, 0.2);
            // background-color: rgba(255, 255, 255, 0.05);
            background-color: rgba(61, 116, 255, 0.05);
            border-radius: 8px;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 1.5rem;

            #title {
                margin: 0;
                font-size: 2.2rem;
                font-weight: 700;
                line-height: 1.2;
                color: gv.$light;
            }

            #date {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: gv.$light;
                // background-color: rgba(61, 116, 255, 0.2);
                // padding: 0.5rem 1rem;
                border-radius: 6px;
            }

            #device, #location {
                font-size: 1rem;
                margin: 0;
                margin-bottom: 0.6rem;
                color: gv.$light;
            }
        }
    }

    #popup-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding-block: 3rem;

        #close-button-container {
            all: unset;
            position: absolute;
            top: 1rem;
            right: 1rem;
            cursor: pointer;
            border-radius: 50%;
            background-color: rgba(255, 153, 0, 0.8);
            width: 2.25rem;
            height: 2.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        img {
            height: 100%;
            object-fit: contain;
            cursor: zoom-in;
            transition: transform 0.3s ease;

            &.zoom {
                cursor: zoom-out;
                transform: scale(2);
            }
        }
    }

    @media (max-width: 800px) {
        .page-container {
            padding: 1rem;
            gap: 1rem;
            max-height: 100vh;
            overflow-y: auto;
            
            .back-navigation {
                margin-bottom: 0;
                
                .back-button {
                    padding: 0.6rem 1rem;
                    font-size: 0.95rem;
                }
            }
            
            .content-wrapper {
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
                
                img {
                    max-height: 55vh;
                    max-width: 100%;
                    object-fit: contain;
                }
            }
            
            .info-container {
                min-width: 0;
                max-width: 100%;
                width: 100%;
                flex: none;
                padding: 1.5rem;
                align-items: center;
                text-align: center;
                
                #title {
                    font-size: 1.8rem;
                    text-align: center;
                }
                
                #date {
                    font-size: 1rem;
                    text-align: center;
                    align-self: center;
                }
                
                #device, #location {
                    font-size: 0.95rem;
                    justify-content: center;
                }
            }
        }
    }

    @media (max-width: 480px) {
        .page-container {
            padding: 0.8rem;
            gap: 0.8rem;
            
            .image-container {
                max-height: 50vh;
                width: 100%;
                padding: 0.5rem;
                
                img {
                    max-height: 47vh;
                    max-width: 100%;
                }
            }
            
            .info-container {
                padding: 1rem;
                gap: 1rem;
                
                #title {
                    font-size: 1.5rem;
                }
                
                #date {
                    font-size: 0.9rem;
                    padding: 0.4rem 0.8rem;
                }
                
                #device, #location {
                    font-size: 0.85rem;
                }
            }
        }
    }
</style>
