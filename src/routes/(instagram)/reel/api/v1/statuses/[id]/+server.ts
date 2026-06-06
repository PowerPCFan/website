import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { fetchReelData, validateId, idToReelUrl } from '$lib/utils/reel/helper';
import { buildMastodonStatus } from '$lib/utils/reel/mastodon';

export const GET: RequestHandler = async ({ params, url }) => {
  const { id } = params;
  if (!validateId(id)) {
    throw error(400, 'Invalid ID');
  }

  const instaData = await fetchReelData(idToReelUrl(id)).catch(() => null);

  if (!instaData) {
    throw error(404, 'Not found');
  }

  const statusJson = buildMastodonStatus(id, instaData, url.origin);

  return new Response(JSON.stringify(statusJson), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
