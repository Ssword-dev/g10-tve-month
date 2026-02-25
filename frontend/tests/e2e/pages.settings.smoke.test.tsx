/// <reference types="vitest-puppeteer" />
import { describe, expect, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";

describe("Dashboard settings pages smoke e2e", () => {
  it("opens settings page", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/settings`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector("text/Manage dashboard preferences");
    } finally {
      await browserContext.close();
    }
  }, 180_000);

  it("opens appearance page and toggles dark mode", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/settings/appearance`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector("text/Appearance");

      const darkModeButton = await browserPage.waitForSelector(
        "xpath///button[contains(normalize-space(.), 'Dark Mode')]",
        { timeout: 10_000 },
      );
      if (!darkModeButton) {
        throw new Error("Dark Mode button not found");
      }
      await darkModeButton.click();

      const hasDarkClass = await browserPage.evaluate(() =>
        document.documentElement.classList.contains("dark"),
      );
      expect(hasDarkClass).toBe(true);
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
