self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('pwa-cache').then(function(cache) {
      return cache.addAll([
        '/lhu/offline/index.html',
        '/lhu/offline/offline.html',
        '/lhu/offline/icons/logo.png'
      ]);
    })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        return response || caches.match('/lhu/offline/offline.html');
      });
    })
  );
});
