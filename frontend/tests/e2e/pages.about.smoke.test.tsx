/// <reference types="vitest-puppeteer" />
import { describe, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";

describe("Dashboard about pages smoke e2e", () => {
  it("opens About > The Team page", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/about/the-team`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector("text/The Developers");
    } finally {
      await browserContext.close();
    }
  }, 180_000);

  it("opens About > The School page", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/about/the-school`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector("text/The School");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
