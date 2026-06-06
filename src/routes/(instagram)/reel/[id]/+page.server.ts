import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createToken } from '$lib/utils/reel/reelDownloadStore';
import { logAction } from '$lib/utils/reel/discordWebhook';
import { fetchReelData, getRequestType, RequestType, validateId, idToReelUrl } from '$lib/utils/reel/helper';

export const load: PageServerLoad = async ({ params, request, url }) => {
  if (!validateId(params.id)) {
    throw error(400, 'Invalid reel ID');
  }

  const requestType = getRequestType(request.headers.get('User-Agent'));

  const reelUrl = idToReelUrl(params.id);

  const instaData = await fetchReelData(reelUrl).catch(() => null);
  if (!instaData) throw error(404, 'Reel not found');

  const urlList = Array.isArray(instaData.url_list) ? instaData.url_list : [];
  const postInfo = instaData.post_info;
  const mediaDetails = instaData.media_details;
  const thumbnailUrl = mediaDetails.find((media) => media.thumbnail)?.thumbnail ?? mediaDetails[0]?.url ?? null;
  const firstVideoUrl = urlList[0] ?? reelUrl;
  const caption = postInfo.caption || '';
  const captionPreview = caption.replace(/\r\n/g, '\n').split('\n')[0].trim();
  const captionSummary = captionPreview.length > 140 ? `${captionPreview.slice(0, 139)}…` : captionPreview;
  const videoViews = mediaDetails.find((media) => typeof media.video_view_count === 'number')?.video_view_count ?? null;
  const pageTitle = `${postInfo.owner_fullname || postInfo.owner_username} (@${postInfo.owner_username})`;
  const ogDescription = `${captionSummary || 'Instagram reel preview'}\n\n❤️ ${postInfo.likes}  👀 ${videoViews ?? 'N/A'}`;

  let videoUrl = reelUrl;
  try {
    const parsedUrl = new URL(firstVideoUrl);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') videoUrl = parsedUrl.toString();
  } catch {
    videoUrl = reelUrl;
  }

  if (requestType === RequestType.DISCORD) {
    void logAction({ id: params.id, videoUrl, postInfo, request, mediaDetails, requestType, thumbnailUrl });
    throw redirect(302, videoUrl);
  }

  const token = createToken(params.id, videoUrl, undefined, {
    postInfo,
    mediaDetails,
    thumbnailUrl,
  });
  const downloadUrl = `./dl?token=${token}`;
  const pageUrl = `${url.origin}${url.pathname}`;
  const oembedUrl = `${url.origin}/reel/oembed?url=${encodeURIComponent(pageUrl)}`;

  void logAction({ id: params.id, videoUrl, postInfo, request, mediaDetails, requestType, thumbnailUrl });

  return {
    id: params.id,
    pageUrl,
    oembedUrl,
    reelUrl,
    videoUrl,
    thumbnailUrl,
    downloadUrl,
    description: 'Watch or download this Instagram reel.',
    postInfo,
    mediaDetails,
    pageTitle,
    ogDescription,
    requestType,
  };
};