/// <reference types="vitest-puppeteer" />
import { describe, it } from "vitest";
import { baseUrl, clickByText, signUpAndLoginAsAdmin } from "../helpers/e2eAuthSession";
import { addEmployeeViaModal, searchEmployeeByName } from "../helpers/e2eEmployeeFlows";

describe("Employees CRUD e2e", () => {
  it("adds, updates, and deletes an employee", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/employees`, { waitUntil: "networkidle2" });

      const added = await addEmployeeViaModal(browserPage, "E2E Employee");

      await searchEmployeeByName(browserPage, added.fullName);
      await browserPage.waitForSelector(`text/${added.fullName}`);

      const employeeCell = await browserPage.waitForSelector(
        `xpath///td[normalize-space()='${added.fullName}']`,
      );
      if (!employeeCell) {
        throw new Error("Added employee row not found");
      }
      await employeeCell.click();

      await browserPage.waitForSelector("text/Employee #");
      await clickByText(browserPage, "Update Record");
      await browserPage.waitForSelector("text/Update Actions -");

      const firstNameInput = await browserPage.waitForSelector(
        "xpath///label[normalize-space()='First Name']/following::input[1]",
      );
      if (!firstNameInput) {
        throw new Error("First Name input not found in update modal");
      }
      await firstNameInput.click({ clickCount: 3 });
      await browserPage.keyboard.type(`${added.firstName}Edited`);
      const saveEmployeeButton = await browserPage.waitForSelector(
        "xpath///div[.//*[contains(normalize-space(), 'Update Actions -')]]//button[normalize-space()='Save Employee']",
      );
      if (!saveEmployeeButton) {
        throw new Error("Save Employee button not found in update modal");
      }
      await saveEmployeeButton.click();
      await browserPage.waitForTimeout(1_500);

      await browserPage.click("button[aria-label='close modal']");

      const updatedFullName = `${added.firstName}Edited ${added.lastName}`;
      await searchEmployeeByName(browserPage, updatedFullName);
      await browserPage.waitForSelector(`text/${updatedFullName}`, {
        timeout: 60_000,
      });

      const updatedEmployeeCell = await browserPage.waitForSelector(
        `xpath///td[normalize-space()='${updatedFullName}']`,
      );
      if (!updatedEmployeeCell) {
        throw new Error("Updated employee row not found");
      }
      await updatedEmployeeCell.click();

      await clickByText(browserPage, "Delete Record");
      await browserPage.waitForSelector("text/Confirm Record Deletion");
      await clickByText(browserPage, "Confirm");
      await browserPage.waitForSelector("text/Confirm Record Deletion", {
        hidden: true,
      });

      await searchEmployeeByName(browserPage, updatedFullName);
      await browserPage.waitForSelector("text/No employees found.");
    } finally {
      await browserContext.close();
    }
  }, 300_000);
});
