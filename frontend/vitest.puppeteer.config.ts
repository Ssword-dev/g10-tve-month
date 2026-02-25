import { join } from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": join(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "puppeteer",
    globalSetup: ["./tests/setup/puppeteerGlobalSetup.ts"],
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    include: ["tests/e2e/**/*.test.tsx"],
    testTimeout: 300_000,
    hookTimeout: 300_000,
    maxWorkers: 4,
    minWorkers: 1,
  },
});
