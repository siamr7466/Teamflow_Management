import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ✅ Fix black screen on Vercel by using relative paths
  base: "./",

  build: {
    // ⚠️ Increase warning limit for large bundles
    chunkSizeWarningLimit: 1000, // default 500 kB

    rollupOptions: {
      output: {
        // Optional: manual chunking to split vendor code
        manualChunks: {
          reactVendor: ['react', 'react-dom'],
        },
      },
    },
  },

  // Optional: clear cache when building on Vercel
  clearScreen: true,
});
