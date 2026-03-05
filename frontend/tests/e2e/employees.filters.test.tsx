/// <reference types="vitest-puppeteer" />
import { describe, it } from "vitest";
import { baseUrl, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";
import { searchEmployeeByName } from "../helpers/e2eEmployeeFlows";

describe("Employees filters e2e", () => {
  it("supports full-name search, no-result state, clear, and modal filters", async () => {
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

      await searchEmployeeByName(browserPage, "Juan Dela Cruz");
      await browserPage.waitForSelector("text/Juan Dela Cruz");

      await searchEmployeeByName(browserPage, "name-not-found-xyz");
      await browserPage.waitForSelector("text/No employees found.");

      await browserPage.click("input[placeholder='Search full name...']", {
        clickCount: 3,
      });
      await browserPage.click("xpath///button[normalize-space()='Clear']");
      await browserPage.waitForSelector(
        "xpath///tr[.//td[contains(normalize-space(), 'Juan')]]",
      );

      const toolButtons = await browserPage.$$(".pointer-events-auto button");
      const filterButton = toolButtons.at(-1);
      if (!filterButton) {
        throw new Error("Filter button not found");
      }
      await filterButton.click();

      await browserPage.waitForSelector("text/Filters");
      await browserPage.click("xpath///button[normalize-space()='Add Column']");
      await browserPage.type(
        "xpath//section[.//*[contains(normalize-space(), 'Column Filters')]]//input",
        "Dela Cruz",
      );
      await browserPage.click(
        "xpath///button[normalize-space()='Apply Filters']",
      );

      await browserPage.waitForSelector("text/Juan Dela Cruz");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
