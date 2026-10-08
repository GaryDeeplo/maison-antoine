// Service worker auto-destructeur : neutralise tout ancien SW périmé
// (responsable des "anciens affichages" servis depuis le cache).
self.addEventListener('install', function () {
  self.skipWaiting();
});
self.addEventListener('activate', function (event) {
  event.waitUntil(
    Promise.resolve()
      .then(function () {
        return self.registration.unregister();
      })
      .then(function () {
        return caches.keys();
      })
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      })
      .then(function () {
        return self.clients.matchAll();
      })
      .then(function (clients) {
        clients.forEach(function (c) {
          if ('navigate' in c) c.navigate(c.url);
        });
      })
  );
});
