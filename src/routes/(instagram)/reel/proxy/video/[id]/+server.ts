import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { fetchReelData, idToReelUrl, validateId } from '$lib/utils/reel/helper';
import { logAction } from '$lib/utils/reel/discordWebhook';

export const GET: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  if (!validateId(id)) {
    throw error(400, 'Invalid reel ID');
  }

  const instaData = await fetchReelData(idToReelUrl(id)).catch(() => null);

  if (!instaData || !instaData.url_list || instaData.url_list.length === 0) {
    throw error(404, 'Video not found');
  }

  void logAction({
    action: 'proxy-video',
    id, 
    request,
    postInfo: instaData.post_info,
    mediaDetails: instaData.media_details,
  });

  const videoUrl = instaData.url_list[0];

  const range = request.headers.get('range');
  const upstreamHeaders: Record<string, string> = {};
  if (range) upstreamHeaders['Range'] = range;

  // Make a HEAD request first to get the headers without the body
  const headResponse = await fetch(videoUrl, { method: 'HEAD' });
  if (!headResponse.ok) {
    // Fallback to GET if HEAD fails
    const getResponse = await fetch(videoUrl, { headers: upstreamHeaders });
    return new Response(getResponse.body, {
      status: getResponse.status,
      headers: getResponse.headers,
    });
  }
  
  const responseHeaders = new Headers(headResponse.headers);

  // Now make the actual range request if needed
  const body = await fetch(videoUrl, {
    headers: upstreamHeaders,
  }).then((res) => res.body);

  return new Response(body, {
    status: range ? 206 : 200,
    headers: responseHeaders,
  });
};
