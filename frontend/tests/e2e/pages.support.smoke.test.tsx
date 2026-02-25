/// <reference types="vitest-puppeteer" />
import { describe, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";

describe("Dashboard support pages smoke e2e", () => {
  it("opens customer service page", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/customer-service`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector("text/Customer Service");
    } finally {
      await browserContext.close();
    }
  }, 180_000);

  it("opens terms and conditions page", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/terms-and-conditions`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector("text/Terms and Conditions");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
