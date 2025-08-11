const CACHE_NAME = 'zh-final-20250811151056';
const ASSETS = ['./','./index.html','./manifest.json','./offline.html','./logo.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate', e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))));
self.addEventListener('fetch', e=>{ if(e.request.method!=='GET') return; e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).catch(()=>caches.match('./offline.html')))); });
