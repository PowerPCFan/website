import type { RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { validateId, idToReelUrl, fetchReelData } from "$lib/utils/reel/helper";
import { logAction } from "$lib/utils/reel/discordWebhook";

export const GET: RequestHandler = async ({ url, request }) => {
  const embedUrl = url.searchParams.get("url");
  if (!embedUrl) {
    throw error(400, "Missing URL parameter");
  }

  const reelIdMatch = embedUrl.match(/\/reel\/([-A-Za-z0-9]{8,16})/);
  const reelId = reelIdMatch ? reelIdMatch[1] : null;

  if (!reelId || !validateId(reelId)) {
    throw error(400, "Invalid reel ID in URL");
  }

  const reelUrl = idToReelUrl(reelId);
  const instaData = await fetchReelData(reelUrl, { retries: 1, delay: 500 }).catch(() => null);

  if (!instaData) {
    throw error(404, "Reel not found");
  }

  const postInfo = instaData.post_info;
  const mediaDetails = instaData.media_details;
  const thumbnailUrl = mediaDetails.find((media) => media.thumbnail)?.thumbnail ?? mediaDetails[0]?.url ?? null;
  const videoUrl = instaData.url_list[0] ?? reelUrl;

  void logAction({
    action: 'oembed',
    id: reelId,
    request,
    postInfo,
    mediaDetails,
    thumbnailUrl,
  });

  const authorName = postInfo.owner_fullname || postInfo.owner_username || "Instagram User";
  const authorHandle = postInfo.owner_username ? `@${postInfo.owner_username}` : "";
  const captionPreview = (postInfo.caption || "No caption available")
    .replace(/\r\n/g, "\n")
    .split("\n")[0]
    .trim();
  const title = `${authorName} ${authorHandle}`.trim();
  const description = `${captionPreview}\n\n❤️ ${postInfo.likes}  👀 ${mediaDetails.find((media) => typeof media.video_view_count === "number")?.video_view_count ?? "N/A"}`;

  const oembedResponse = {
    version: "1.0",
    type: "video",
    provider_name: "powerpcfan.xyz",
    provider_url: url.origin,
    title: title,
    author_name: authorName,
    // thumbnail_url: thumbnailUrl,
    // thumbnail_width: mediaDetails[0]?.dimensions.width || 320,
    // thumbnail_height: mediaDetails[0]?.dimensions.height || 180,
    width: mediaDetails[0]?.dimensions.width || 320,
    height: mediaDetails[0]?.dimensions.height || 180,
    url: videoUrl,
    description: description,
  };

  return new Response(JSON.stringify(oembedResponse), {
    headers: {
      "Content-Type": "application/json+oembed",
    },
  });
};
