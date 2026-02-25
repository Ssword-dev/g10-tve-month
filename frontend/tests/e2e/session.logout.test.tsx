/// <reference types="vitest-puppeteer" />
import { describe, expect, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";
import { openProfileMenuAndSignOut } from "../helpers/e2eEmployeeFlows";

describe("Session logout e2e", () => {
  it("signs out and prevents privileged overview access", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/overview`, { waitUntil: "networkidle2" });
      await browserPage.waitForSelector("text/Employee Summary");

      await openProfileMenuAndSignOut(browserPage);

      await browserPage.goto(`${baseUrl}/dashboard/overview`, { waitUntil: "networkidle2" });
      await browserPage.waitForFunction(
        () => window.location.pathname === "/dashboard/employees",
        { timeout: 15_000 },
      );

      await browserPage.goBack({ waitUntil: "networkidle2" });
      await browserPage.waitForFunction(
        () => window.location.pathname !== "/dashboard/overview",
        { timeout: 15_000 },
      );

      const pathname = await browserPage.evaluate(() => window.location.pathname);
      expect(pathname).not.toBe("/dashboard/overview");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
