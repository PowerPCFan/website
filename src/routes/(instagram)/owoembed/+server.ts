import type { RequestHandler } from './$types';
import { logAction } from '$lib/utils/reel/discordWebhook';
import { idToReelUrl } from '$lib/utils/reel/helper';

export const GET: RequestHandler = async ({ url, request }) => {
  const text = url.searchParams.get('text');
  const author = url.searchParams.get('author');
  const status = url.searchParams.get('status');
  
  void logAction({
    action: 'owoembed',
    id: status || undefined,
    request,
  });

  const statusUrl = idToReelUrl(status || '');

  const oembed = {
    type: 'rich',
    version: '1.0',
    title: 'Embed',
    author_name: text || 'Instagram Reel',
    author_url: statusUrl,
    provider_name: 'powerpcfan.xyz',
    provider_url: url.origin
  };

  return new Response(JSON.stringify(oembed), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
};
