<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";

    let shareUrl: string | null = $state(null);
    let listingName: string | null = $state(null);
    let error: string | null = $state(null);

    onMount(() => {
        const url = page?.url?.searchParams?.get("url");
        const name = page?.url?.searchParams?.get("name");

        if (!url) {
            error = "No ?url= provided";
            return;
        }

        if (!name) {
            error = "No ?name= provided";
            return;
        }

        try {
            shareUrl = new URL(url).toString();
            listingName = name.toString();
            const maxLen = 60;
            if (listingName.length > maxLen) {
                listingName = listingName.slice(0, maxLen - 3) + "...";
            }
        } catch {
            error = "Invalid URL or name provided.";
        }
    });

    async function share() {
        if (!navigator.share) {
            error = "Share API is unsupported in your browser.";
            return;
        }

        try {
            await navigator.share({
                title: "Share link",
                // @ts-expect-error
                url: shareUrl
            });
        } catch (err: any) {
            if (err.name !== "AbortError") {
                error = "Failed to open share sheet.";
            }
        }
    }
</script>

{#if error}
    <p>{error}</p>
{:else if shareUrl}
    <button onclick={share}>
        Share &quot;{listingName}&quot; &lpar;{new URL(shareUrl).hostname}&rpar;
    </button>
{:else}
    <p>Loading...</p>
{/if}

<style>
    button {
        padding: 12px 16px;
        font-size: 24px;
        border-radius: 8px;
        border: none;
        background: #ffffff;
        color: #000000;
        cursor: pointer;
        font-family: inherit;
    }
</style>
