import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "puppeteer",
    globalSetup: ["./tests/setup/puppeteerGlobalSetup.ts"],
    include: ["tests/e2e/app.puppeteer.test.ts"],
    testTimeout: 300_000,
    hookTimeout: 300_000,
    maxWorkers: 1,
    minWorkers: 1,
  },
});
