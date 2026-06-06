import type { RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { validateId, idToReelUrl, fetchReelData } from "$lib/utils/reel/helper";
import { logAction } from "$lib/utils/reel/discordWebhook";

export const GET: RequestHandler = async ({ url, request }) => {
  const id = url.searchParams.get("id");

  if (!id || !validateId(id)) {
    throw error(400, "Invalid reel ID");
  }

  const reelUrl = idToReelUrl(id);
  const instaData = await fetchReelData(reelUrl, { retries: 1, delay: 500 }).catch(() => null);

  if (!instaData) {
    throw error(404, "Reel not found");
  }

  const postInfo = instaData.post_info;
  const mediaDetails = instaData.media_details;
  const thumbnailUrl = mediaDetails.find((media) => media.thumbnail)?.thumbnail ?? mediaDetails[0]?.url ?? null;

  void logAction({
    action: 'oembed',
    id: id,
    request,
    postInfo,
    mediaDetails,
    thumbnailUrl,
  });

  const oembedResponse = {
    author_name: `❤️ ${postInfo.likes}  👀 ${mediaDetails.find((media) => typeof media.video_view_count === "number")?.video_view_count ?? "N/A"}`,
    author_url: `${url.origin}/reel/${id}`,
    provider_name: `❤️ ${postInfo.likes}  👀 ${mediaDetails.find((media) => typeof media.video_view_count === "number")?.video_view_count ?? "N/A"}`,
    provider_url: `${url.origin}/reel/${id}`,
    title: "Embed",
    type: "rich",
    version: "1.0"
  };

  return new Response(JSON.stringify(oembedResponse), {
    headers: {
      "Content-Type": "application/json+oembed",
    },
  });
};
