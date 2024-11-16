const cacheName = "v1";
const urlsToCache = [
    "/Scheduler/",
    "/Scheduler/style.css",
    "/Scheduler/supabase.js",
    "/Scheduler/manifest.json",
    "/Scheduler/scheduler any.png",
    "/Scheduler/scheduler maskable.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
