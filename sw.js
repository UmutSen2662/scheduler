importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

// Precache and route static files
workbox.precaching.precacheAndRoute([
    { url: "/Scheduler/", revision: null },
    { url: "/Scheduler/index.html", revision: "1" },
    { url: "/Scheduler/style.css", revision: "1" },
    { url: "/Scheduler/manifest.json", revision: "1" },
    { url: "/Scheduler/scheduler any.png", revision: "1" },
    { url: "/Scheduler/scheduler maskable.png", revision: "1" },
]);
