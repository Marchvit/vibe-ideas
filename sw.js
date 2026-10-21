// Полностью офлайн: всё отдаём сразу из памяти телефона,
// а если есть интернет — тихо обновляем копию к следующему запуску
const FILES = ['./', 'merge.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting(); // новая версия включается сразу, не дожидаясь закрытия всех окон
  e.waitUntil(caches.open('v1').then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  // Синхронизация с GitHub идёт мимо кэша, иначе приходили бы старые данные
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // no-cache: сверяемся с сервером, а не берём копию браузера (GitHub Pages разрешает ей жить 10 минут)
  const update = fetch(e.request.url, { cache: 'no-cache' }).then(async r => {
    if (r.ok) await caches.open('v1').then(c => c.put(e.request, r.clone()));
    return r;
  });
  e.waitUntil(update.catch(() => {})); // без интернета обновление просто пропускаем
  e.respondWith(caches.match(e.request).then(r => r || update));
});
