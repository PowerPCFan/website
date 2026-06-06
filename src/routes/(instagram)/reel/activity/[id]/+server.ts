import { error, type RequestHandler } from '@sveltejs/kit';
import { fetchReelData, validateId, idToReelUrl } from '$lib/utils/reel/helper';

export const GET: RequestHandler = async ({ params, url }) => {
  const { id } = params;
  if (!validateId(id)) {
    throw error(400, 'Invalid ID');
  }

  const instaData = await fetchReelData(idToReelUrl(id)).catch(() => null);

  if (!instaData) {
    throw error(404, 'Not found');
  }

  const { post_info, media_details } = instaData;
  const video = media_details[0];

  const published = new Date().toISOString(); 

  const content = `<p>${post_info.caption || ''}</p><p>❤️ ${post_info.likes}  👀 ${video?.video_view_count ?? 'N/A'}</p>`;

  const activity = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `${url.origin}/reel/activity/${id}`,
    type: 'Note',
    published,
    url: `${url.origin}/reel/${id}`,
    attributedTo: {
      type: 'Person',
      id: `${url.origin}/user/${post_info.owner_username}`,
      name: post_info.owner_fullname,
      preferredUsername: post_info.owner_username,
      url: `https://instagram.com/${post_info.owner_username}`,
    },
    content: content,
    attachment: [
      {
        type: 'Document',
        mediaType: 'video/mp4',
        url: `${url.origin}/reel/proxy/video/${id}`,
        width: video?.dimensions.width ?? 720,
        height: video?.dimensions.height ?? 1280,
      },
    ],
    image: {
      type: 'Image',
      mediaType: 'image/jpeg',
      url: `${url.origin}/reel/proxy/thumbnail/${id}`,
      width: video?.dimensions.width ?? 720,
      height: video?.dimensions.height ?? 1280,
    },
  };

  return new Response(JSON.stringify(activity), {
    headers: {
      'Content-Type': 'application/activity+json',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
