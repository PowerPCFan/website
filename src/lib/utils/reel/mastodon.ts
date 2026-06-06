import { idToReelUrl, type InstagramResponse } from './helper';

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function clamp(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function previewFirstLine(text: string, maxLength: number) {
  const normalized = text.replace(/\r\n/g, '\n');
  const [firstLine = ''] = normalized.split('\n');
  const trimmed = firstLine.trim();
  const truncated = clamp(trimmed, maxLength);
  return normalized.includes('\n') ? `${truncated}…` : truncated;
}

export function buildMastodonStatus(id: string, instaData: InstagramResponse, origin: string) {
  const postInfo = instaData.post_info;
  const mediaDetails = instaData.media_details;
  const video = mediaDetails[0];

  const captionLine = previewFirstLine(postInfo.caption || 'Instagram reel', 140);
  const likesStr = formatNumber(postInfo.likes);
  const viewsStr = formatNumber(video?.video_view_count);
  const content = `${captionLine}<br><br><b>❤️ ${likesStr}&ensp;👁️ ${viewsStr}</b>`;

  let width = video?.dimensions.width ?? 720;
  let height = video?.dimensions.height ?? 1280;
  let mult = 1;
  if (width > 1920 || height > 1920) mult = 0.5;
  if (width < 400 && height < 400) mult = 2;
  
  width = Math.round(width * mult);
  height = Math.round(height * mult);

  const media_attachments = [];
  if (video) {
    media_attachments.push({
      id: '0',
      type: 'video',
    //   url: `${origin}/reel/proxy/video/${id}`,
    url: video.url,
      preview_url: `${origin}/reel/proxy/thumbnail/${id}`,
      remote_url: null,
      preview_remote_url: null,
      text_url: null,
      description: null,
      meta: {
        original: {
          width,
          height,
          size: `${width}x${height}`,
          aspect: width / height
        }
      }
    });
  }

  const postUrl = idToReelUrl(id);

  return {
    id: id,
    url: postUrl,
    uri: postUrl,
    created_at: new Date().toISOString(),
    edited_at: null,
    reblog: null,
    in_reply_to_id: null,
    in_reply_to_account_id: null,
    language: 'en',
    content,
    spoiler_text: '',
    visibility: 'public',
    application: {
      name: 'Instagram',
      website: null
    },
    media_attachments,
    account: {
      id: postInfo.owner_username,
      display_name: postInfo.owner_fullname || postInfo.owner_username,
      username: postInfo.owner_username,
      acct: postInfo.owner_username,
      url: postUrl,
      uri: postUrl,
      created_at: new Date().toISOString(),
      locked: false,
      bot: false,
      discoverable: true,
      indexable: false,
      group: false,
      avatar: `${origin}/reel/proxy/thumbnail/${id}`,
      avatar_static: `${origin}/reel/proxy/thumbnail/${id}`,
      header: '',
      header_static: '',
      followers_count: 0,
      following_count: 0,
      statuses_count: 0,
      hide_collections: false,
      noindex: false,
      emojis: [],
      roles: [],
      fields: []
    },
    mentions: [],
    tags: [],
    emojis: [],
    card: null,
    poll: null
  };
}
