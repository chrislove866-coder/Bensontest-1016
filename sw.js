/**
 * 自主檢查表離線版：Service Worker
 * 第一次開啟時把所有檔案存到裝置，之後沒有網路也能開啟。
 * VERSION 由 tools/build_offline.py 依檔案內容自動更新；版本變了會換新快取。
 */
const VERSION = '3caf74b82a';
const CACHE = `selfcheck-offline-${VERSION}`;
const FILES = [
  './',
  'index.html',
  'app.css',
  'offline-store.js',
  'offline-app.js',
  'manifest.webmanifest',
  'css/style.css',
  'js/pages/self-check.js',
  'js/pages/self-check-print.js',
  'js/vendor/html2pdf.bundle.min.js',
  'data/templates.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('selfcheck-offline-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// 先用裝置上的快取（離線可用）；快取沒有的才連網路
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)),
  );
});
