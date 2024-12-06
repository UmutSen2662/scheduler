import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "METU Scheduler and CEF",
                short_name: "Scheduler",
                theme_color: "#f0f0f0",
                icons: [
                    {
                        src: "./scheduler any.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/scheduler maskable.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
    base: "/Scheduler/",
    build: {
        target: "esnext", // Enables modern JavaScript features
        outDir: "docs",
    },
});
