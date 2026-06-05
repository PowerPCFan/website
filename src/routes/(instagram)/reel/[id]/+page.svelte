<script lang="ts">
    type PageData = {
        id: string;
        reelUrl: string;
        videoUrl: string;
        thumbnailUrl?: string | null;
        downloadUrl?: string;
        description: string;
        requestType?: string;
    };

    let { data }: { data: PageData } = $props();

    const pageTitle = `Watch Reel ${data.id}`;
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#1c1c1c" />
    <meta property="og:type" content="video.other" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={data.description} />
    <meta property="og:url" content={data.reelUrl} />
    <meta property="og:video" content={data.videoUrl} />
    <meta property="og:video:secure_url" content={data.videoUrl} />
    <meta property="og:video:type" content="video/mp4" />
    {#if data.thumbnailUrl}
        <meta property="og:image" content={data.thumbnailUrl} />
        <meta property="og:image:secure_url" content={data.thumbnailUrl} />
        <meta name="twitter:image" content={data.thumbnailUrl} />
    {/if}
    <meta name="twitter:card" content="player" />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={data.description} />
</svelte:head>

<div class="page-shell">
    <div class="container">
        <h1>View Reel <code>{data.id}</code></h1>
        <!-- svelte-ignore a11y_media_has_caption -->
        <video controls preload="metadata" poster={data.thumbnailUrl ?? undefined}>
            <source src={data.videoUrl} type="video/mp4" />
        </video>

        <div class="links">
            <a class="button" href={data.reelUrl} target="_blank" rel="noopener noreferrer">View on Instagram</a>
            {#if data.downloadUrl}
                <a class="button" href={data.downloadUrl} download>Download Video</a>
            {/if}
            <a class="button" href={data.videoUrl} target="_blank" rel="noopener noreferrer">Open Raw Video</a>
        </div>
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    code {
        background: g.$lighter-dark;
        padding-inline: 8px;
        padding-block: 1px;
        border: 2px solid lighten(g.$lighter-dark, 10%);
        border-radius: 6px;
    }

    .page-shell {
        margin: 0;
        padding: 32px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        color: g.$light;
        font-family: Inter, system-ui, sans-serif;
    }

    .container {
        width: min(960px, 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        margin: 0 0 16px;
        font-size: 2rem;
    }

    video {
        max-height: 75vh;
        width: auto;
        height: auto;
        border-radius: 16px;
    }

    .links {
        margin-top: 18px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 11px 16px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: g.$light;
        text-decoration: none;
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);

        &:hover {
            background: rgba(255, 255, 255, 0.14);
        }
    }
</style>
