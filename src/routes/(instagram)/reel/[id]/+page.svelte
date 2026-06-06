<script lang="ts">
    type PageData = {
        id: string;
        pageUrl: string;
        oembedUrl: string;
        activityUrl: string;
        reelUrl: string;
        videoUrl: string;
        videoWidth: number;
        videoHeight: number;
        thumbnailUrl?: string | null;
        downloadUrl?: string;
        description: string;
        postInfo?: {
            owner_username: string;
            owner_fullname: string;
            is_verified: boolean;
            is_private: boolean;
            likes: number;
            is_ad: boolean;
            caption: string;
        };
        mediaDetails?: {
            type: string;
            dimensions: {
                height: number;
                width: number;
            };
            url: string;
            video_view_count?: number;
            thumbnail?: string;
        }[];
        pageTitle?: string;
        ogDescription?: string;
        isDiscord?: boolean;
    };

    let { data }: { data: PageData } = $props();

    const pageTitle = data.pageTitle ?? `Watch Reel ${data.id}`;
    const authorName = data.postInfo?.owner_fullname || data.postInfo?.owner_username || 'Instagram Reel';
    const authorHandle = data.postInfo?.owner_username || '';
    const captionPreview = (data.postInfo?.caption || 'No caption available')
        .replace(/\r\n/g, '\n')
        .split('\n')[0]
        .trim();
    const captionSnippet = captionPreview.length > 160 ? `${captionPreview.slice(0, 159)}…` : captionPreview;
    const views = data.mediaDetails?.find((media) => typeof media.video_view_count === 'number')?.video_view_count ?? 'N/A';
</script>

<svelte:head>
    <title>{pageTitle}</title>

    <link rel="canonical" href={data.pageUrl} />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#405DE6" />

    <meta property="og:title" content={`${authorName} (@${authorHandle})`.trim()} />
    <meta property="twitter:title" content={`${authorName} (@${authorHandle})`.trim()} />
    <meta name="twitter:title" content={`${authorName} (@${authorHandle})`.trim()} />

    <meta name="description" content={data.ogDescription ?? data.description} />
    <meta property="og:description" content={data.ogDescription ?? data.description} />
    <meta property="twitter:description" content={data.ogDescription ?? data.description} />
    <meta name="twitter:description" content={data.ogDescription ?? data.description} />

    {#if data.postInfo?.owner_username}
        <meta name="twitter:creator" content={`@${data.postInfo.owner_username}`} />
    {/if}

    {#if !data.isDiscord}
        <meta property="twitter:card" content="player"/>
        <meta name="twitter:player:stream" content={data.videoUrl} />
        <meta name="twitter:player:stream:content_type" content="video/mp4" />

        <meta property="og:video" content={data.videoUrl} />
        <meta property="og:video:secure_url" content={data.videoUrl} />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content={String(data.videoWidth)} />
        <meta property="og:video:height" content={String(data.videoHeight)} />
        <meta property="twitter:player:width" content={String(data.videoWidth)} />
        <meta property="twitter:player:height" content={String(data.videoHeight)} />
    {/if}

    <link rel="alternate" type="application/json+oembed" href={data.oembedUrl} title={pageTitle}>
    {#if data.isDiscord}
        <link rel="alternate" type="application/activity+json" href={data.activityUrl} />
    {/if}
</svelte:head>

<div class="page-shell">
    <div class="container">
        <h1>View Reel <code>{data.id}</code></h1>
        <!-- svelte-ignore a11y_media_has_caption -->
        <video controls preload="metadata" poster={data.thumbnailUrl ?? undefined}>
            <source src={data.videoUrl} type="video/mp4" />
        </video>

        <div class="action-stack">
            {#if data.postInfo}
                <div class="meta-card">
                    <div class="meta-topline">
                        <span class="meta-author">{authorName}</span>
                        {#if authorHandle}
                            <span class="meta-handle">{authorHandle}</span>
                        {/if}
                    </div>
                    <div class="meta-caption">{captionSnippet}</div>
                    <div class="meta-stats">❤️ {data.postInfo.likes}&nbsp;&nbsp;👀 {views}</div>
                </div>
            {/if}

            <div class="links">
                <a class="button" href={data.reelUrl} target="_blank" rel="noopener noreferrer">View on Instagram</a>
                {#if data.downloadUrl}
                    <a class="button" href={data.downloadUrl} download>Download Video</a>
                {/if}
                <a class="button" href={data.videoUrl} target="_blank" rel="noopener noreferrer">Open Raw Video</a>
            </div>
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

    .action-stack {
        width: max-content;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        align-self: center;
    }

    h1 {
        margin: 0 0 16px;
        font-size: 2rem;
    }

    .meta-card {
        width: 100%;
        max-width: 100%;
        margin-top: 16px;
        padding: 14px 16px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .meta-topline {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: baseline;
    }

    .meta-author {
        font-weight: 700;
        font-size: 1rem;
    }

    .meta-handle {
        opacity: 0.78;
        font-size: 0.95rem;
    }

    .meta-caption {
        line-height: 1.5;
        opacity: 0.95;
    }

    .meta-stats {
        opacity: 0.82;
        font-size: 0.95rem;
    }

    video {
        max-height: 60vh;  // todo: improve the video sizing
        width: auto;
        height: auto;
        border-radius: 16px;
    }

    .links {
        margin-top: 18px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        width: 100%;
        max-width: 100%;
        justify-content: center;
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
