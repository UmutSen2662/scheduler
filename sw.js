importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

// Check if Workbox is available
if (workbox) {
    console.log("Workbox is loaded");

    // Precache and route static files
    workbox.precaching.precacheAndRoute([
        { url: "/Scheduler/", revision: null },
        { url: "/Scheduler/index.html", revision: "1" },
        { url: "/Scheduler/style.css", revision: "1" },
        { url: "/Scheduler/manifest.json", revision: "1" },
        { url: "/Scheduler/scheduler any.png", revision: "1" },
        { url: "/Scheduler/scheduler maskable.png", revision: "1" },
    ]);

    // Cache images with a Cache First strategy
    workbox.routing.registerRoute(
        ({ request }) => request.destination === "image",
        new workbox.strategies.CacheFirst({
            cacheName: "images",
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                }),
            ],
        })
    );
} else {
    console.error("Workbox did not load");
}
