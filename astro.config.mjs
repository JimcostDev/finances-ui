// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@components": path.resolve(__dirname, "src/components"),
          "@layouts": path.resolve(__dirname, "src/layouts"),
          "@services": path.resolve(__dirname, "src/services/index.ts"),
          "@interfaces": path.resolve(__dirname, "src/interfaces/index.ts"),
        },
      },
    },

  integrations: [react()],
  output: 'server', 
  adapter: vercel(),
});