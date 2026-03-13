import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

import { solidStart } from "@solidjs/start/config";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidStart(),
    nitro(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Coordinate Checker',
        short_name: 'CoordCheck',
        description: 'Real-time GPS Coordinate Checker and Saver PWA',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }) as any
  ]
});
