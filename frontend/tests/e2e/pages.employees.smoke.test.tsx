/// <reference types="vitest-puppeteer" />
import { describe, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";

describe("Dashboard employees page smoke e2e", () => {
  it("opens employees page and renders search controls", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/employees`, {
        waitUntil: "networkidle2",
      });
      await browserPage.waitForSelector(
        "input[placeholder='Search full name...']",
      );
      await browserPage.waitForSelector("text/Search");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
