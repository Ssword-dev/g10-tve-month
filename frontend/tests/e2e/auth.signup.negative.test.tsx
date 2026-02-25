/// <reference types="vitest-puppeteer" />
import { describe, expect, it } from "vitest";
import { baseUrl, clickByText } from "../helpers/e2eAuthSession";

describe("Auth signup negative e2e", () => {
  it("shows client-side mismatch error for confirm password", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await browserPage.goto(`${baseUrl}/signup`, { waitUntil: "networkidle2" });
      await browserPage.waitForSelector("#employeeNumber");

      await browserPage.type("#employeeNumber", String(990000 + (Date.now() % 1000)));
      await browserPage.type("#firstName", "Mismatch");
      await browserPage.type("#lastName", "User");
      await clickByText(browserPage, "Next");
      await clickByText(browserPage, "Next");
      await browserPage.type("#designation", "Teacher I");
      await browserPage.type("#employmentStatus", "Permanent");
      await clickByText(browserPage, "Next");
      await browserPage.type("#password", "P@ssword1234");
      await browserPage.type("#confirmPassword", "P@ssword9999");
      await clickByText(browserPage, "Create Admin Account");

      await browserPage.waitForSelector("text/Passwords do not match.", {
        timeout: 15_000,
      });
      const pathname = await browserPage.evaluate(() => window.location.pathname);
      expect(pathname).toBe("/signup");
    } finally {
      await browserContext.close();
    }
  }, 180_000);

  it("shows backend duplicate employee error", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await browserPage.goto(`${baseUrl}/signup`, { waitUntil: "networkidle2" });
      await browserPage.waitForSelector("#employeeNumber");

      await browserPage.type("#employeeNumber", "10001");
      await browserPage.type("#firstName", "Duplicate");
      await browserPage.type("#lastName", "Account");
      await browserPage.type("#depedEmail", `dup-${Date.now()}@deped.gov.ph`);

      await clickByText(browserPage, "Next");
      await clickByText(browserPage, "Next");
      await browserPage.type("#designation", "Teacher I");
      await browserPage.type("#employmentStatus", "Permanent");
      await clickByText(browserPage, "Next");

      await browserPage.type("#password", "P@ssword1234");
      await browserPage.type("#confirmPassword", "P@ssword1234");
      await clickByText(browserPage, "Create Admin Account");

      await browserPage.waitForSelector("text/Employee number already exists.", {
        timeout: 15_000,
      });
      const pathname = await browserPage.evaluate(() => window.location.pathname);
      expect(pathname).toBe("/signup");
    } finally {
      await browserContext.close();
    }
  }, 180_000);
});
