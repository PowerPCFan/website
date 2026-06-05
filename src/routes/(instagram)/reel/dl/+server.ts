import type { RequestHandler } from '@sveltejs/kit';
import { consumeToken } from '$lib/utils/reel/reelDownloadStore';
import { logAction } from '$lib/utils/reel/discordWebhook';

export const GET: RequestHandler = async ({ url, request }) => {
  const token = url.searchParams.get('token');
  if (!token) return new Response(null, { status: 404 });

  const entry = consumeToken(token);
  if (!entry) return new Response(null, { status: 404 });

  const { id, videoUrl, meta } = entry as { id: string; videoUrl: string; meta?: { postInfo?: any; mediaDetails?: any; thumbnailUrl?: string | null } };
  const postInfo = meta?.postInfo ?? meta;

  try {
    void logAction({
      id,
      videoUrl,
      downloadToken: token,
      request,
      postInfo,
      mediaDetails: meta?.mediaDetails,
      thumbnailUrl: meta?.thumbnailUrl ?? postInfo?.thumbnailUrl,
    });
  } catch (e) {
    // ignore
  }

  const range = request.headers.get('range');
  const upstreamHeaders: Record<string, string> = {};
  if (range) upstreamHeaders['Range'] = range;

  const upstream = await fetch(videoUrl, {
    method: 'GET',
    headers: upstreamHeaders
  });

  if (!upstream.ok) {
    return new Response(null, { status: upstream.status });
  }

  const resHeaders = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) resHeaders.set('Content-Type', ct);
  const cl = upstream.headers.get('content-length');
  if (cl) resHeaders.set('Content-Length', cl);
  const cr = upstream.headers.get('content-range');
  if (cr) resHeaders.set('Content-Range', cr);
  const ar = upstream.headers.get('accept-ranges');
  if (ar) resHeaders.set('Accept-Ranges', ar);
  const cc = upstream.headers.get('cache-control');
  if (cc) resHeaders.set('Cache-Control', cc);

  const filename = `reel-${id}.mp4`;
  resHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders
  });
};
