// Чтобы приложение открывалось без интернета: сначала сеть, если её нет — копия из кэша
self.addEventListener('install', e =>
  e.waitUntil(caches.open('v1').then(c => c.addAll(['./', 'merge.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'])))
);

self.addEventListener('fetch', e =>
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open('v1').then(c => c.put(e.request, copy));
        return r;
      })
      .catch(() => caches.match(e.request))
  )
);
