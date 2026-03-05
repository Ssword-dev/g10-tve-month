import { defineConfig } from "vite";

// React JSX for vite.
import react from "@vitejs/plugin-react";

// Tailwind CSS for vite.
import tailwindcss from "@tailwindcss/vite";
import { dirname, join } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": join(__dirname, "src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    rollupOptions: {
      external: ["tests/**/*.tsx?"],
    },

    // build to the artifacts directory so
    // i do not have to ship everything including
    // the unbuilt website source code to the client.
    outDir: dirname(__dirname) + "/artifacts/frontend",
  },
});
