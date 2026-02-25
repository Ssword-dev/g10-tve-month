/// <reference types="vitest-puppeteer" />
import { describe, expect, it } from "vitest";
import { baseUrl } from "../helpers/e2eAuthSession";
import waitForTimeout from "../helpers/waitForTimeout";

describe("Auth login negative e2e", () => {
  it("stays on login for malformed email input", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await browserPage.goto(`${baseUrl}/login`, { waitUntil: "networkidle2" });
      await browserPage.type("#deped-email", "not-an-email");
      await browserPage.type("#password", "any-password");
      await browserPage.click("button[type='submit']");

      await waitForTimeout(1_000);

      const pathname = await browserPage.evaluate(
        () => window.location.pathname,
      );
      expect(pathname).toBe("/login");
    } finally {
      await browserContext.close();
    }
  }, 180_000);

  it("rejects wrong credentials and stays on login", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await browserPage.goto(`${baseUrl}/login`, { waitUntil: "networkidle2" });
      await browserPage.type("#deped-email", "missing.admin@deped.gov.ph");
      await browserPage.type("#password", "WrongPassword123");
      await browserPage.click("button[type='submit']");

      await browserPage.waitForFunction(
        () => {
          const body = document.body.textContent?.toLowerCase() ?? "";
          return body.includes("invalid") && body.includes("password");
        },
        { timeout: 15_000 },
      );

      const pathname = await browserPage.evaluate(
        () => window.location.pathname,
      );
      expect(pathname).toBe("/login");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
