/// <reference types="vitest-puppeteer" />
import { describe, expect, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";

describe("Route guards e2e", () => {
  it("redirects guest from /dashboard/overview to /dashboard/employees", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await browserPage.goto(`${baseUrl}/dashboard/overview`, {
        waitUntil: "networkidle2",
      });

      await browserPage.waitForFunction(
        () => window.location.pathname === "/dashboard/employees",
        { timeout: 15_000 },
      );
      await browserPage.waitForSelector("input[placeholder='Search full name...']");
    } finally {
      await browserContext.close();
    }
  }, 180_000);

  it("redirects authenticated users away from /login and /signup", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);

      await browserPage.goto(`${baseUrl}/login`, { waitUntil: "networkidle2" });
      await browserPage.waitForFunction(
        () => window.location.pathname.startsWith("/dashboard"),
        { timeout: 15_000 },
      );

      await browserPage.goto(`${baseUrl}/signup`, { waitUntil: "networkidle2" });
      await browserPage.waitForFunction(
        () => window.location.pathname.startsWith("/dashboard"),
        { timeout: 15_000 },
      );

      const pathname = await browserPage.evaluate(() => window.location.pathname);
      expect(pathname.startsWith("/dashboard")).toBe(true);
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
