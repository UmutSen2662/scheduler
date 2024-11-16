const cacheName = "v3";
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

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || (navigator.onLine ? fetch(event.request) : undefined);
        })
    );
});
