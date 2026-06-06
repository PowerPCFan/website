import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { fetchReelData, validateId, idToReelUrl } from '$lib/utils/reel/helper';
import { logAction } from '$lib/utils/reel/discordWebhook';

export const GET: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  if (!validateId(id)) {
    throw error(400, 'Invalid reel ID');
  }

  const instaData = await fetchReelData(idToReelUrl(id)).catch(() => null);

  if (!instaData || !instaData.media_details || instaData.media_details.length === 0) {
    throw error(404, 'Thumbnail not found');
  }

  void logAction({
    action: 'proxy-thumbnail',
    id,
    request,
    postInfo: instaData.post_info,
    mediaDetails: instaData.media_details,
  });

  const thumbnailUrl = instaData.media_details.find((m) => m.thumbnail)?.thumbnail ?? instaData.media_details[0]?.url;

  if (!thumbnailUrl) {
    throw error(404, 'Thumbnail not found');
  }

  const upstream = await fetch(thumbnailUrl);

  if (!upstream.ok) {
    return new Response(upstream.body, { status: upstream.status, headers: upstream.headers });
  }

  const resHeaders = new Headers();
  for (const h of ['content-type', 'content-length', 'cache-control', 'last-modified', 'etag']) {
    if (upstream.headers.has(h)) {
      resHeaders.set(h, upstream.headers.get(h)!);
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
};
