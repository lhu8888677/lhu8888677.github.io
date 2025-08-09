// /lhu/service-worker.js
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `lhu-landfee-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/lhu/',
  '/lhu/index.html',
  '/lhu/offline.html',
  '/lhu/manifest.json',
  '/lhu/logo.png',
  '/lhu/icons/icon-192.png',
  '/lhu/icons/icon-512.png',
  // 若有獨立 CSS/JS 檔，請加上，例如：
  // '/lhu/style.css',
  // '/lhu/app.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Cache-first，離線時回 offline.html
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只攔截同網域 /lhu/ 範圍
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/lhu/')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          // 只快取 GET 成功回應
          if (request.method === 'GET' && resp && resp.status === 200 && resp.type === 'basic') {
            const respClone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
          }
          return resp;
        })
        .catch(() => {
          // HTML 要回離線頁，其它資源就放棄
          if (request.destination === 'document') {
            return caches.match('/lhu/offline.html');
          }
        });
    })
  );
});