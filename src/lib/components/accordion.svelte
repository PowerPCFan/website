<script lang="ts">
    import { onMount } from 'svelte';

    let { title, titleStyles, openByDefault = false, children } = $props();

    let open: boolean = $state(!!openByDefault);
    let accordionContentRef: HTMLDivElement;
    let openedByHash: boolean = $state(false);

    function toggle() {
        open = !open;

        if (open) {
            set_opened_by_hash_state(false);
        }
    }

    function scroll_element_into_view(element: Element) {
        setTimeout(() => {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 400);
    }

    function open_accordion() {
        open = true;
    }

    function close_accordion() {
        open = false;
    }

    function set_opened_by_hash_state(state: boolean) {
        openedByHash = state || (openedByHash || false);
    }

    function checkHashAndOpen() {
        const hash = window.location.hash;

        if (hash && accordionContentRef) {
            const targetElement = accordionContentRef.querySelector(hash);

            if (targetElement) {
                if (!open) {
                    open_accordion();
                    set_opened_by_hash_state(true);
                }

                scroll_element_into_view(targetElement);
            } else {
                if (openedByHash) {
                    close_accordion();
                    set_opened_by_hash_state(false);
                }
            }
        } else {
            if (openedByHash) {
                close_accordion();
                set_opened_by_hash_state(false);
            }
        }
    }

    onMount(() => {
        checkHashAndOpen();

        const handleHashChange = () => {checkHashAndOpen()};

        window.addEventListener('hashchange', handleHashChange);

        return () => {window.removeEventListener('hashchange', handleHashChange)};
    });
</script>

<div class="accordion-item">
    <button class="accordion-header" onclick={toggle} aria-expanded={open}>
        <h2 style="{titleStyles}">{title}</h2>
        <i class="fa-solid fa-chevron-down" class:rotated={open}></i>
    </button>

    <div class="accordion-content" class:open={open} bind:this={accordionContentRef}>
        <div class="accordion-content-inner">
            {@render children()}
        </div>
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .accordion-item {
        border: 2px solid g.$border;
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 0.5rem;

        .accordion-header {
            background-color: inherit;
            color: inherit;
            font-family: inherit;
            width: 100%;
            padding: 1rem;
            border: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 1rem;
            font-weight: 600;
            text-align: left;
            cursor: pointer;

            h2 {
                margin: 0;
                padding: 0;
                font-weight: inherit;
                font-family: inherit;
                line-height: 1;
                flex: 1;
            }

            i {
                transition: transform 0.3s ease;
                font-size: 0.9rem;
            }

            i.rotated {
                transform: rotate(180deg);
            }
        }

        .accordion-content {
            display: grid;
            grid-template-rows: 0fr;
            overflow: hidden;
            transition: 
                grid-template-rows 0.4s ease,
                padding 0.3s ease;
            padding: 0 1rem;

            &.open {
                border-top: 2px solid g.$border; 
                grid-template-rows: 1fr;
                padding: 0 1rem 1rem 1rem;
            }

            .accordion-content-inner {
                overflow: hidden;
            }
        }
    }
</style>

<!-- old version without fancy hash stuff -->
<!-- <script lang="ts">
    let { title, titleStyles, openByDefault = false, children } = $props();
    
    let open: boolean = $state(openByDefault ? true : false);

    function toggle() {
        open = !open;
    }
</script>

<div class="accordion-item">
    <button class="accordion-header" onclick={toggle} aria-expanded={open}>
        <h2 style="{titleStyles}">{title}</h2>
        <i class="fa-solid fa-chevron-down" class:rotated={open}></i>
    </button>

    <div class="accordion-content" class:open={open}>
        <div class="accordion-content-inner">
            {@render children()}
        </div>
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .accordion-item {
        border: 2px solid g.$border;
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 0.5rem;

        .accordion-header {
            background-color: inherit;
            color: inherit;
            font-family: inherit;
            width: 100%;
            padding: 1rem;
            border: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 1rem;
            font-weight: 600;
            text-align: left;
            cursor: pointer;

            h2 {
                margin: 0;
                padding: 0;
                font-weight: inherit;
                font-family: inherit;
                line-height: 1;
                flex: 1;
            }

            i {
                transition: transform 0.3s ease;
                font-size: 0.9rem;
            }

            i.rotated {
                transform: rotate(180deg);
            }
        }

        .accordion-content {
            display: grid;
            grid-template-rows: 0fr;
            overflow: hidden;
            transition: 
                grid-template-rows 0.4s ease,
                padding 0.3s ease;
            padding: 0 1rem;

            &.open {
                border-top: 2px solid g.$border; 
                grid-template-rows: 1fr;
                padding: 0 1rem 1rem 1rem;
            }

            .accordion-content-inner {
                overflow: hidden;
            }
        }
    }
</style> -->