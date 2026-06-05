export interface InstagramResponse {
  results_number: number;
  url_list: string[];
  post_info: {
    owner_username: string;
    owner_fullname: string;
    is_verified: boolean;
    is_private: boolean;
    likes: number;
    is_ad: boolean;
    caption: string;
  };
  media_details: {
    type: string;
    dimensions: {
      height: number;
      width: number;
    };
    url: string;
    video_view_count?: number;
    thumbnail?: string;
  }[];
}

export enum RequestType {
  DISCORD = 'discord',
  CRAWLER = 'nondiscordbot',
  BROWSER = 'browser',
}

export function validateId(id: string | undefined): id is string {
  return typeof id === 'string' && /^[-A-Za-z0-9]{8,16}$/.test(id);
}

export function idToReelUrl(id: string) {
  return `https://www.instagram.com/reel/${id}`;
}

export function getRequestType(userAgent: string | null): RequestType {
  const normalizedUserAgent = (userAgent || '').toLowerCase();

  // if (/discordbot/i.test(normalizedUserAgent)) {
  //   return RequestType.DISCORD;
  // }

  if (/\b(bot|crawler|spider|curl|wget|python-requests|fetch|httpclient|feedfetcher|slack|facebookexternalhit|facebot|twitterbot|whatsapp|linkedinbot|ahrefsbot|semrushbot|bingbot|bingpreview|googlebot)\b/i.test(normalizedUserAgent)) {
    return RequestType.CRAWLER;
  }

  return RequestType.BROWSER;
}

async function checkRedirect(url: string) {
  const split_url = url.split('/');
  if (split_url.includes('share')) {
    const res = await fetch(url, { redirect: 'follow' });
    return res.url;
  }

  return url;
}

function formatPostInfo(requestData: any) {
  try {
    let mediaCapt = requestData.edge_media_to_caption.edges;
    const capt = mediaCapt.length === 0 ? '' : mediaCapt[0].node.text;
    return {
      owner_username: requestData.owner.username,
      owner_fullname: requestData.owner.full_name,
      is_verified: requestData.owner.is_verified,
      is_private: requestData.owner.is_private,
      likes: requestData.edge_media_preview_like.count,
      is_ad: requestData.is_ad,
      caption: capt,
    };
  } catch (err: any) {
    throw new Error(`Failed to format post info: ${err.message}`);
  }
}

function formatMediaDetails(mediaData: any) {
  try {
    if (mediaData.is_video) {
      return {
        type: 'video',
        dimensions: mediaData.dimensions,
        video_view_count: mediaData.video_view_count,
        url: mediaData.video_url,
        thumbnail: mediaData.display_url,
      };
    } else {
      return {
        type: 'image',
        dimensions: mediaData.dimensions,
        url: mediaData.display_url,
      };
    }
  } catch (err: any) {
    throw new Error(`Failed to format media details: ${err.message}`);
  }
}

function getShortcode(url: string) {
  try {
    let split_url = url.split('/');
    let post_tags = ['p', 'reel', 'tv', 'reels'];
    let index_shortcode = split_url.findIndex((item) => post_tags.includes(item)) + 1;
    let shortcode = split_url[index_shortcode];
    return shortcode;
  } catch (err: any) {
    throw new Error(`Failed to obtain shortcode: ${err.message}`);
  }
}

async function getCSRFToken() {
  try {
    const response = await fetch('https://www.instagram.com/', {
      method: 'GET',
    });
    const setCookie = response.headers.get('set-cookie');
    if (!setCookie) throw new Error('CSRF token not found in response headers.');
    const csrfCookie = setCookie.split(';')[0];
    const csrfToken = csrfCookie.replace('csrftoken=', '');
    return csrfToken;
  } catch (err: any) {
    throw new Error(`Failed to obtain CSRF: ${err.message}`);
  }
}

function isSidecar(requestData: any) {
  try {
    return requestData['__typename'] == 'XDTGraphSidecar';
  } catch (err: any) {
    throw new Error(`Failed sidecar verification: ${err.message}`);
  }
}

async function instagramRequest(shortcode: string, retries: number, delay: number) {
  const BASE_URL = 'https://www.instagram.com/graphql/query';
  const INSTAGRAM_DOCUMENT_ID = '9510064595728286';
  const params = new URLSearchParams();
  params.set(
    'variables',
    JSON.stringify({
      shortcode,
      fetch_tagged_user_count: null,
      hoisted_comment_id: null,
      hoisted_reply_id: null,
    }),
  );
  params.set('doc_id', INSTAGRAM_DOCUMENT_ID);

  const token = await getCSRFToken();

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'X-CSRFToken': token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if ([429, 403].includes(response.status) && retries > 0) {
      const retryAfter = response.headers.get('retry-after');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
      await new Promise((res) => setTimeout(res, waitTime));
      return instagramRequest(shortcode, retries - 1, delay * 2);
    }

    if (!response.ok) throw new Error(`Instagram request failed with status ${response.status}`);

    const json = await response.json();
    if (!json.data?.xdt_shortcode_media) throw new Error('Only posts/reels supported, check if your link is valid.');
    return json.data.xdt_shortcode_media;
  } catch (err: any) {
    throw new Error(`Failed instagram request: ${err.message}`);
  }
}

function createOutputData(requestData: any) {
  try {
    let url_list: string[] = [], media_details: any[] = [];
    const IS_SIDECAR = isSidecar(requestData);
    if (IS_SIDECAR) {
      requestData.edge_sidecar_to_children.edges.forEach((media: any) => {
        media_details.push(formatMediaDetails(media.node));
        if (media.node.is_video) {
          url_list.push(media.node.video_url as string);
        } else {
          url_list.push(media.node.display_url as string);
        }
      });
    } else {
      media_details.push(formatMediaDetails(requestData));
      if (requestData.is_video) {
        url_list.push(requestData.video_url as string);
      } else {
        url_list.push(requestData.display_url as string);
      }
    }

    return {
      results_number: url_list.length,
      url_list,
      post_info: formatPostInfo(requestData),
      media_details,
    } as InstagramResponse;
  } catch (err: any) {
    throw new Error(`Failed to create output data: ${err.message}`);
  }
}

export async function fetchReelData(url_media: string, config = { retries: 5, delay: 1000 }): Promise<InstagramResponse> {
  try {
    url_media = await checkRedirect(url_media);
    const SHORTCODE = getShortcode(url_media);
    const INSTAGRAM_REQUEST = await instagramRequest(SHORTCODE, config.retries, config.delay);
    const OUTPUT_DATA = createOutputData(INSTAGRAM_REQUEST);
    return OUTPUT_DATA as InstagramResponse;
  } catch (err: any) {
    throw err;
  }
}
