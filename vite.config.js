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
                display_override: ["standalone", "minimal-ui", "browser", "window-controls-overlay"],
                orientation: "natural",
                lang: "en",
                icons: [
                    {
                        src: "./scheduler-any.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "./scheduler-maskable.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
                categories: ["productivity", "utilities"],
                description: "Scheduler is an app that allows you to create a schedule and see current exams",
            },
        }),
    ],
    build: {
        target: "esnext", // Enables modern JavaScript features
    },
});
