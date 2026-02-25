import {
  setup as setupPuppeteer,
  teardown as teardownPuppeteer,
} from "vitest-environment-puppeteer/global-init";
import setupStack from "./puppeteerStackSetup";

export default async function globalSetup(ctx: unknown) {
  const teardownStack = await setupStack();
  await setupPuppeteer(ctx as { config: Record<string, unknown> });

  return async () => {
    await teardownPuppeteer();
    await teardownStack();
  };
}
