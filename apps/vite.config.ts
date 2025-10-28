import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  // If CLOUDFLARE_ENV is not explicitly provided, default it to the Vite mode
  // This aligns Vite modes with Cloudflare environments for redirected configs
  if (!process.env.CLOUDFLARE_ENV) {
    process.env.CLOUDFLARE_ENV = mode;
  }

  return {
    envPrefix: [
      'VITE_',
      // Expose our config vars used in the browser (read-only)
      'PORTAL_',
      'RPC_URL_',
      'CHAIN_ID_',
      'DEFAULT_GAS_LIMIT',
    ],
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: "./src/react-app/routes",
        generatedRouteTree: "./src/react-app/routeTree.gen.ts",
      }),
      tailwindcss(),
      react(),
      cloudflare(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
