import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const text = url.searchParams.get('text');
  const author = url.searchParams.get('author');
  const status = url.searchParams.get('status');
  
  const statusUrl = `https://www.instagram.com/reel/${status}`;
  
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
