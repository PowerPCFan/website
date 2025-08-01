<script lang="ts">
    import { slide } from "svelte/transition";

    let { title, openByDefault = false, children } = $props();

    let open: boolean = $state(!!openByDefault);
</script>

<div class="accordion">
    <button class="acc-button" onclick={() => {open = !open}} aria-expanded={open}>
        <span class="title">{title}</span>
        <i class="icon fa-solid fa-chevron-down" class:rotated={open}></i>
    </button>
    {#if open}
        <div class="content" transition:slide>
            {@render children()}
        </div>
    {/if}
</div>


<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .accordion {
        border-left: 2px solid g.$border;
        padding-left: 1rem;
        margin-bottom: 0.5rem;
    }

    .acc-button {
        all: unset;

        font-family: g.$stack;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        padding: 0.4rem 0;
        user-select: none;

        .title {
            transition: border-bottom-color 0.15s ease;

            text-decoration: none;
            border-bottom: 2px solid transparent;
        }

        &:hover {
            .title {
                text-decoration: none;
                border-bottom-color: g.$border;
            }
        }
    }

    .content {
        margin-top: 1rem;
        overflow: hidden;
        padding-left: 0.5rem;
    }

    .icon {
        font-size: 0.8rem;
        margin-right: 0.5rem;
        transition: transform 0.2s ease;

        &.rotated {
            transform: rotate(180deg);
        }
    }

    .title {
        margin-right: 0.5rem;
    }
</style>
