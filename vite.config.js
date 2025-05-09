import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "src", "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, "src/index.html"),
    //     sw: resolve(__dirname, "src/scripts/sw.js"),
    //   },
    //   output: {
    //     entryFileNames: (chunkInfo) => {
    //       return chunkInfo.name === "sw" ? "sw.js" : "assets/[name]-[hash].js";
    //     },
    //     manualChunks(id) {
    //       if (id.includes("sw.js")) {
    //         return "sw";
    //       }
    //     },
    //   },
    // },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "false",
      strategies: "injectManifest",
      srcDir: "scripts",
      filename: "sw.js",
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
