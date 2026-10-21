// Полностью офлайн: всё отдаём сразу из памяти телефона,
// а если есть интернет — тихо обновляем копию к следующему запуску
const FILES = ['./', 'merge.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => e.waitUntil(caches.open('v1').then(c => c.addAll(FILES))));

self.addEventListener('fetch', e => {
  const update = fetch(e.request).then(async r => {
    if (r.ok) await caches.open('v1').then(c => c.put(e.request, r.clone()));
    return r;
  });
  e.waitUntil(update.catch(() => {})); // без интернета обновление просто пропускаем
  e.respondWith(caches.match(e.request).then(r => r || update));
});
