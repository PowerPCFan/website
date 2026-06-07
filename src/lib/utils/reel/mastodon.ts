import { idToReelUrl, smartTruncate, formatNumber, type InstagramResponse } from './helper';

export function buildMastodonStatus(id: string, instaData: InstagramResponse, origin: string) {
  const postInfo = instaData.post_info;
  const mediaDetails = instaData.media_details;
  const video = mediaDetails[0];

  const truncatedCaption = smartTruncate(postInfo.caption || 'Instagram reel', 5, 300);
  const captionHtml = truncatedCaption.replace(/\r?\n/g, '<br>');
  const likesStr = formatNumber(postInfo.likes);
  const viewsStr = formatNumber(video?.video_view_count);
  const commentsStr = formatNumber(postInfo.comment_count);
  const followersStr = formatNumber(postInfo.followers_count);

  let content: string = captionHtml + '<br><br>';
  if (!postInfo.like_and_view_counts_disabled) {
    content += `<b>❤️ ${likesStr}&ensp;👀 ${viewsStr}&ensp;💬 ${commentsStr}&ensp;👥 ${followersStr}</b>`;
  } else {
    content = `<i>Stats are hidden for this reel</i>`;
  }

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
      url: video.url,
      preview_url: video.thumbnail ?? null,
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
    created_at: new Date(postInfo.taken_at_timestamp * 1000).toISOString(),
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
      created_at: null,
      locked: false,
      bot: false,
      discoverable: true,
      indexable: false,
      group: false,
      avatar: postInfo.profile_pic_url,
      avatar_static: postInfo.profile_pic_url,
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
