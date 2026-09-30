// ປ່ຽນເລກ version ທຸກຄັ້ງທີ່ແກ້ index.html ຫຼື ໄອຄອນ ເພື່ອໃຫ້ເຄື່ອງຜູ້ໃຊ້ອັບເດດ
const CACHE = 'kongtun-v3';
const SHELL = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// ເກັບສະເພາະໄຟລ໌ຂອງ wrapper ເທົ່ານັ້ນ — ຂໍ້ມູນ GAS ດຶງສົດຈາກເຊີບເວີທຸກເທື່ອ
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
