import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script-defer",
      includeAssets: ["pwa-192x192.png", "pwa-512x512.png", "pwa-icon.svg"],
      manifest: {
        name: "Postify",
        short_name: "Postify",
        description:
          "Okumak için değil, uygulamak için: rehberler, karar notları, açıklayıcılar ve saha notları.",
        theme_color: "#15181c",
        background_color: "#f3f4f1",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,webp,svg,woff2}"],
        globIgnores: [
          "**/editor-*.js",
          "**/markdown-*.js",
          "**/AnalyticsCharts-*.js",
          "**/motion-*.js",
          "**/gradient-*.js",
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-z0-9]+\.supabase\.co\/rest\/v1\/(posts|post_translations)(?:\?.*)?$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "postify-public-content-v1",
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
        ],
      },
    }),
  ],
  base: "/",
  build: {
    outDir: "docs",
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    modulePreload: {
      resolveDependencies: (_filename, deps) => deps.filter((dependency) => (
        !/\/(editor|markdown|AnalyticsCharts|motion|gradient)-/.test(dependency)
      )),
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Keep shared Radix helpers out of the optional Supabase vendor.
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('@tiptap') || id.includes('prosemirror')) return 'editor';
          if (id.includes('/gsap/')) return 'motion';
          if (id.includes('/@supabase/')) return 'supabase';
          if (id.includes('/react-icons/')) return 'icons';
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/') ||
            id.includes('/use-sync-external-store/')
          ) return 'react-vendor';

          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 450,
  },
  server: {
    port: 5173,
    open: true,
  },
});
