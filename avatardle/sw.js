// sw.js — Image fetch fixer for Avatardle
// Tries alternate casings, folders, and extensions when an image 404s.

const EXTS = ['webp','png','jpg','jpeg','svg','WEBP','PNG','JPG','JPEG','SVG'];
const FOLDERS = ['images', 'Images', 'images/atla', 'images/lok', 'Images/ATLA', 'Images/LoK'];

function slugify(s) {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Helper: try a list of URLs sequentially, return first 200 OK
async function tryCandidates(cands, originalReq) {
  for (const url of cands) {
    try {
      const res = await fetch(url, { mode: 'same-origin', redirect: 'follow', cache: 'default' });
      if (res && res.ok) return res;
    } catch (_) {}
  }
  // If nothing worked, try original (so devtools shows the real failing URL)
  try { return await fetch(originalReq); } catch (e) { return Response.error(); }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only try to “rescue” same-origin image requests
  const isSameOrigin = (url.origin === self.location.origin);
  const isImageDest = (req.destination === 'image') || /\.(png|jpg|jpeg|webp|svg)$/i.test(url.pathname);

  if (!isSameOrigin || !isImageDest) return;

  event.respondWith((async () => {
    // First, try the original as-is
    try {
      const initial = await fetch(req);
      if (initial && initial.ok) return initial;
    } catch (_) {}

    // Build candidate list
    const path = decodeURIComponent(url.pathname.replace(/^\//, '')); // relative path w/o leading slash
    const parts = path.split('/');
    const file = parts.pop() || '';
    const folder = parts.join('/');

    // filename pieces
    const base = file.replace(/\.[^.]+$/, '');
    const ext = (file.match(/\.([^.]+)$/) || [,''])[1];

    // Variants of base name we’ll try
    const bases = Array.from(new Set([
      base,
      base.toLowerCase(),
      base.toUpperCase(),
      slugify(base),
      decodeURIComponent(base)
    ]));

    // folders we’ll try (keep original folder first)
    const folders = Array.from(new Set([
      folder,
      ...FOLDERS
    ])).filter(Boolean);

    // extensions to try (keep original ext if present)
    const exts = ext ? Array.from(new Set([ext, ...EXTS])) : EXTS;

    // Build URLs
    const candidates = [];
    for (const f of folders) {
      for (const b of bases) {
        for (const e of exts) {
          const cand = (f ? `/${f}/${b}.${e}` : `/${b}.${e}`);
          candidates.push(new URL(cand, url.origin).toString());
        }
      }
    }

    // As a last resort, also try the raw name in images/ & Images/ with all exts
    for (const folderGuess of ['images', 'Images']) {
      for (const e of exts) {
        candidates.push(`${url.origin}/${folderGuess}/${file || base}.${e}`);
      }
    }

    // Try in order; return the first that works
    const res = await tryCandidates(candidates, req);
    return res;
  })());
});
