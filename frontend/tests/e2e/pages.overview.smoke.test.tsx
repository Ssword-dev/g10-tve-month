/// <reference types="vitest-puppeteer" />
import { describe, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";

describe("Dashboard overview page smoke e2e", () => {
  it("opens overview page", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/overview`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector("text/Employee Summary");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
