import { defineConfig } from "vite";

// React JSX for vite.
import react from "@vitejs/plugin-react";

// Tailwind CSS for vite.
import tailwindcss from "@tailwindcss/vite";
import { join } from "path";

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
});
