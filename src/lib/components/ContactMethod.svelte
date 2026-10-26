<script lang="ts">
    let { imageUrl, link }: { imageUrl?: string; link: string } = $props();

    let cleanLink = $derived(link.toLowerCase());
    let isExternal = $derived(cleanLink.startsWith("http://") || cleanLink.startsWith("https://"));
    let fontAwesomeIconName = $derived.by((): string | null => {
        if (imageUrl) return null;

        if (cleanLink.includes("mailto:")) {
            return "fa-solid fa-envelope";
        }
        if (cleanLink.includes("youtube.com")) {
            return "fa-brands fa-square-youtube";
        }
        if (cleanLink.includes("spotify.com")) {
            return "fa-brands fa-spotify";
        }
        if (cleanLink.includes("steamcommunity.com")) {
            return "fa-brands fa-steam";
        }

        return null;
    });

    let resolvedImageUrl = $derived.by(() => {
        if (imageUrl) return imageUrl;

        if (cleanLink.includes("github.com")) {
            return "/images/logos/github.svg";
        }

        if (fontAwesomeIconName) return null;

        return "/images/logos/open.svg";
    });
</script>

<a href={link} class="flex flex-col justify-start" target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
    {#if !fontAwesomeIconName}
        <img class="w-8! opacity-80 transition-opacity hover:opacity-100" src={resolvedImageUrl} alt="Contact icon" />
    {:else}
        <div class="inline-flex flex-col justify-start w-8! text-[2rem] text-white opacity-80 transition-opacity hover:opacity-100">
            <i class="font-awesome-icon {fontAwesomeIconName}"></i>
        </div>
    {/if}
</a>
