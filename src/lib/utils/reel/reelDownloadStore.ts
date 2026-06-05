// this is not that secure but i honestly dont care lmao

type Entry = {
  id: string;
  videoUrl: string;
  meta?: any;
  expiresAt: number;
};

const store = new Map<string, Entry>();

function generateTokenHex() {
  const crypto = globalThis.crypto;

  if (crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  let s = '';
  while (s.length < 32) {
    s += Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  }
  return s.slice(0, 32);
}

export function createToken(id: string, videoUrl: string, ttlMs = 2 * 60 * 1000, meta?: any) {
  const token = generateTokenHex();
  const expiresAt = Date.now() + ttlMs;
  store.set(token, { id, videoUrl, meta, expiresAt });
  return token;
}

export function consumeToken(token: string) {
  const entry = store.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(token);
    return null;
  }
  store.delete(token);
  return entry;
}

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) {
    if (v.expiresAt < now) store.delete(k);
  }
}, 60 * 1000);

if (typeof (cleanupTimer as any).unref === 'function') (cleanupTimer as any).unref();
