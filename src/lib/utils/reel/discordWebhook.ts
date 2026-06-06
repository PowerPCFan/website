import { env } from '$env/dynamic/private';
import { idToReelUrl } from './helper';

const REEL_HOOK: string | null = env.REEL_HOOK || null;
const DISCORD_SEND_TIMEOUT_MS = 10_000;
const IP_API_TIMEOUT_MS = 5_000;
const DISCORD_MAX_RETRIES = 3;

type IpLocation = {
  country?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
};

const ipLocationCache = new Map<string, IpLocation | null>();

type QueueItem = {
  payload: Record<string, unknown>;
  attempt: number;
};

const discordQueue: QueueItem[] = [];
let discordQueueFlushing = false;
let discordQueueTimer: ReturnType<typeof setInterval> | null = null;

function clamp(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function previewFirstLine(text: string, maxLength: number) {
  const normalized = text.replace(/\r\n/g, '\n');
  const [firstLine = ''] = normalized.split('\n');
  const trimmed = firstLine.trim();
  const truncated = clamp(trimmed, maxLength);
  return normalized.includes('\n') ? `${truncated}...` : truncated;
}

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return /discordbot|bot|crawler|spider|curl|wget|python-requests|fetch|httpclient|feedfetcher|slack|facebookexternalhit|facebot|twitterbot|whatsapp|linkedinbot|ahrefsbot|semrushbot|bingbot|bingpreview|googlebot/i.test(ua);
}

type WebhookDetails = {
  action: string;
  id?: string;
  videoUrl?: string;
  downloadToken?: string;
  requestUrl?: string | null;
  requestHost?: string | null;
  requestPath?: string | null;
  userAgent?: string | null;
  ip?: string;
  ipLocation?: IpLocation | null;
  thumbnailUrl?: string | null;
  postInfo?: {
    owner_username: string;
    owner_fullname: string;
    is_verified: boolean;
    is_private: boolean;
    likes: number;
    is_ad: boolean;
    caption: string;
  };
  mediaDetails?: {
    type: string;
    dimensions: {
      height: number;
      width: number;
    };
    url: string;
    video_view_count?: number;
    thumbnail?: string;
  }[];
  extra?: Record<string, string>;
};

function getRemoteIp(headers: Headers | null): string | null {
  if (!headers) return null;
  const xff = headers.get('x-forwarded-for') || headers.get('x-real-ip') || headers.get('cf-connecting-ip');
  if (xff) return xff.split(',')[0].trim();
  return null;
}

async function getIpLocation(ip: string): Promise<IpLocation | null> {
  if (!ip || ip === 'unknown') return null;

  if (ipLocationCache.has(ip)) {
    return ipLocationCache.get(ip) ?? null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), IP_API_TIMEOUT_MS);
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      ipLocationCache.set(ip, null);
      return null;
    }

    const data = await response.json() as { status?: string; message?: string } & IpLocation;
    if (data.status && data.status !== 'success') {
      ipLocationCache.set(ip, null);
      return null;
    }

    const location: IpLocation = {
      country: data.country,
      regionName: data.regionName,
      city: data.city,
      zip: data.zip,
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org
    };

    ipLocationCache.set(ip, location);
    return location;
  } catch {
    ipLocationCache.set(ip, null);
    return null;
  }
}

function buildRequestUrl(req: Request): { url: string; host: string | null } {
  const parsed = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || parsed.host;
  const proto = req.headers.get('x-forwarded-proto') || parsed.protocol.replace(':', '');
  const normalizedHost = host ?? parsed.host;
  const normalizedUrl = `${proto}://${normalizedHost}${parsed.pathname}${parsed.search}`;

  return {
    url: normalizedUrl,
    host: normalizedHost,
  };
}

function buildDiscordPayload(details: WebhookDetails) {
  const title = details.action.charAt(0).toUpperCase() + details.action.slice(1);

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [];

  if (details.id) fields.push({ name: '🏷️ Reel ID', value: `\`${clamp(details.id, 120)}\``, inline: true });
  if (details.requestUrl) fields.push({ name: '📍 Requested URL', value: `[${details.requestPath}](${details.requestUrl})`, inline: true });
  if (details.downloadToken) fields.push({ name: '🔐 Download token', value: `\`${clamp(details.downloadToken, 128)}\``, inline: true });
  
  if (details.userAgent && isCrawler(details.userAgent)) {
    fields.push({ name: '🧭 User Agent (Crawler)', value: `\`${clamp(details.userAgent, 1000)}\``, inline: false });
  } else if (details.userAgent) {
    fields.push({ name: '🧭 User Agent', value: `\`${clamp(details.userAgent, 1000)}\``, inline: false });
  }

  if (details.ip) fields.push({ name: '🌐 IP', value: `\`${details.ip}\``, inline: true });

  if (details.ipLocation) {
    const ipl: IpLocation = details.ipLocation;
    const extraBits: string[] = [];
    const values = new Map<string, string>();

    if (ipl.country && ipl.regionName && ipl.city) {
      values.set('Location', `${ipl.city}, ${ipl.regionName}, ${ipl.country}`);
    }
    if (ipl.timezone) values.set('Timezone', ipl.timezone);
    if (ipl.isp) values.set('ISP', `${ipl.isp} (${ipl.org})`);

    for (const [k, v] of values.entries()) {
      extraBits.push(`- **${k}:** \`${v}\``);
    }

    fields.push({
      name: '🌎 Location',
      value: extraBits.join('\n') || 'N/A',
      inline: false,
    });
  }

  if (details.extra) {
    for (const [k, v] of Object.entries(details.extra)) {
      fields.push({ name: k, value: String(v), inline: true });
    }
  }

  const post = details.postInfo;
  const media = details.mediaDetails;

  if (post) {
    const overview = `- 📝 Caption: ${previewFirstLine(post.caption || 'N/A', 600)}\n- 👤 Username: @${post.owner_username || 'N/A'}\n- 📊 Stats: ❤️ ${post.likes ?? 'N/A'}  •  👀 ${media?.[0]?.video_view_count ?? 'N/A'}`;
    fields.unshift({ name: '📄 Post Overview', value: overview, inline: false });
  }

  fields.unshift({ name: '⚡ Action', value: `**${details.action}**`, inline: true });

  return {
    embeds: [
      {
        title: 'Action Performed: ' + title + ' (Click to view on Instagram)',
        description: '',
        color: 0x5865f2,
        fields,
        url: details.id ? idToReelUrl(details.id) : undefined,
        thumbnail: details.thumbnailUrl ? { url: details.thumbnailUrl } : undefined,
        timestamp: new Date().toISOString(),
      }
    ]
  };
}

async function postDiscordPayload(payload: Record<string, unknown>) {
  if (!REEL_HOOK) {
    console.warn('Discord webhook for reel telemetry not configured (REEL_HOOK)');
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DISCORD_SEND_TIMEOUT_MS);
    const res = await fetch(REEL_HOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const body = await res.text().catch(() => '<no body>');
      throw new Error(`Discord webhook responded with ${res.status}: ${body}`);
    }
  } catch (e) {
    throw e;
  }
}

function ensureDiscordQueuePump() {
  if (discordQueueTimer) return;

  discordQueueTimer = setInterval(() => {
    void flushDiscordQueue();
  }, 5_000);

  const timer = discordQueueTimer as unknown as { unref?: () => void };
  if (typeof timer.unref === 'function') {
    timer.unref();
  }
}

async function flushDiscordQueue() {
  if (discordQueueFlushing || discordQueue.length === 0) return;
  discordQueueFlushing = true;

  try {
    while (discordQueue.length > 0) {
      const item = discordQueue.shift();
      if (!item) continue;

      try {
        await postDiscordPayload(item.payload);
      } catch (error) {
        if (item.attempt < DISCORD_MAX_RETRIES) {
          discordQueue.push({ payload: item.payload, attempt: item.attempt + 1 });
        } else {
          console.error('Discord webhook dropped after retries', error);
        }
      }
    }
  } finally {
    discordQueueFlushing = false;
  }
}

function queueDiscordWebhook(details: WebhookDetails) {
  const payload = buildDiscordPayload(details);
  discordQueue.push({ payload, attempt: 0 });
  ensureDiscordQueuePump();
  void flushDiscordQueue();
}

export async function logAction(event: { id?: string; videoUrl?: string; downloadToken?: string; request?: Request; postInfo?: any; mediaDetails?: any; thumbnailUrl?: string | null; action?: string }) {
  const req = event.request;
  const ua = req ? req.headers.get('user-agent') : null;
  const isCrawler = ua ? /bot|crawler|spider|curl|wget|python-requests|fetch|httpclient|feedfetcher|slack|facebookexternalhit|facebot|twitterbot|whatsapp|linkedinbot|ahrefsbot|semrushbot|bingbot|bingpreview|googlebot|discordbot/i.test(ua) : false;

  let ip: string | undefined = undefined;
  let ipLocation: IpLocation | null = null;

  if (!isCrawler) {
    ip = req ? (getRemoteIp(req.headers) || 'unknown') : 'unknown';
    ipLocation = await getIpLocation(ip);
  }

  const requestInfo = req ? buildRequestUrl(req) : { url: null, host: null };
  const requestPath = req ? new URL(req.url).pathname + new URL(req.url).search : null;

  queueDiscordWebhook({
    action: event.action || (event.downloadToken ? 'download' : 'view'),
    id: event.id,
    videoUrl: event.videoUrl,
    downloadToken: event.downloadToken,
    requestUrl: requestInfo.url,
    requestHost: requestInfo.host,
    requestPath,
    userAgent: ua,
    ip,
    ipLocation,
    ...(event.postInfo ? { postInfo: event.postInfo } : {}),
    ...(event.mediaDetails ? { mediaDetails: event.mediaDetails } : {}),
    ...(event.thumbnailUrl ? { thumbnailUrl: event.thumbnailUrl } : {}),
  } as any);
}

export { queueDiscordWebhook as sendDiscordWebhook };
