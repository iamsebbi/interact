import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
// @ts-expect-error tailwind.config.js is an untyped JS module
import tailwindConfig from "./tailwind.config.js";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig as any), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("shiki") || id.includes("@shikijs")) {
            return;
          }
          if (id.includes("/motion/") || id.includes("framer-motion")) {
            return "vendor-motion";
          }
          if (
            id.includes("@animate-ui") ||
            id.includes("@base-ui") ||
            id.includes("@radix-ui") ||
            id.includes("@number-flow") ||
            id.includes("border-beam")
          ) {
            return "vendor-ui";
          }
          return "vendor-react";
        },
      },
    },
  },
});
