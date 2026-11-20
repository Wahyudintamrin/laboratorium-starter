/* Service worker — memungkinkan situs dibuka tanpa internet setelah dikunjungi sekali.
   Strategi: berkas situs sendiri = jaringan dulu, cadangan dari cache (selalu terbaru bila online).
   TIDAK PERNAH menyimpan: panggilan API server (/api/), Supabase, atau permintaan selain GET.
   Naikkan VERSI bila daftar PRECACHE berubah. */
var VERSI = 'lss-v1';
/*PRECACHE-BEGIN*/var PRECACHE = ["./","app.js","authUI.js","cloud.js","config.js","diagcases.js","diagnosticLab.js","diagramPhotos.js","faultEngine.js","favicon.svg","index.html","instructorPlatform.js","learningAssessment.js","learningHub-data.js","learningHub.js","learningJobSheets.js","learningLessons.js","learningModules.js","learningQuestions.js","login.html","manifest.webmanifest","mobile-ui.js","multimeter.js","panduan.html","progressApi.js","realtimeParameter.js","style.css","superadmin.html","theme.js","three.min.js","visual3d.js","images/aki.png","images/aki.webp","images/flywheel.png","images/flywheel.webp","images/fuse.png","images/fuse.webp","images/icon-192.png","images/icon-512.png","images/kunci-kontak.png","images/kunci-kontak.webp","images/mesin.png","images/mesin.webp","images/motor-starter.png","images/motor-starter.webp","images/pinion.png","images/pinion.webp","images/relay.png","images/relay.webp","images/selenoid.png","images/selenoid.webp","fonts/inter-400.woff","fonts/inter-500.woff","fonts/inter-600.woff","fonts/inter-700.woff","fonts/inter-800.woff"];/*PRECACHE-END*/
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) {
    /* satu berkas gagal tidak menggagalkan seluruh pemasangan */
    return Promise.all(PRECACHE.map(function (u) { return c.add(u).catch(function () { }); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin || u.pathname.indexOf('/api/') === 0) return;
  e.respondWith(fetch(r).then(function (res) {
    if (res && res.ok && res.type === 'basic') { var cp = res.clone(); caches.open(VERSI).then(function (c) { c.put(r, cp); }); }
    return res;
  }).catch(function () {
    return caches.match(r, { ignoreSearch: true }).then(function (m) { return m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()); });
  }));
});
