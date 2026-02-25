/// <reference types="vitest-puppeteer" />
import { describe, expect, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";

describe("Settings theme persistence e2e", () => {
  it("persists dark mode after reload", async () => {
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
      );
      if (!darkModeButton) {
        throw new Error("Dark Mode button not found");
      }
      await darkModeButton.click();

      await browserPage.waitForFunction(() =>
        document.documentElement.classList.contains("dark"),
      );

      await browserPage.reload({ waitUntil: "networkidle2" });
      await browserPage.waitForSelector("text/Appearance");

      const isDark = await browserPage.evaluate(() =>
        document.documentElement.classList.contains("dark"),
      );
      const stored = await browserPage.evaluate(() =>
        window.localStorage.getItem("sems.theme"),
      );

      expect(isDark).toBe(true);
      expect(stored).toBe("dark");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
