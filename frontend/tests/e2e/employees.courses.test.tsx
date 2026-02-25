/// <reference types="vitest-puppeteer" />
import { describe, it } from "vitest";
import {
  baseUrl,
  clickByText,
  signUpAndLoginAsAdmin,
} from "../helpers/e2eAuthSession";
import {
  addEmployeeViaModal,
  searchEmployeeByName,
} from "../helpers/e2eEmployeeFlows";
import waitForTimeout from "../helpers/waitForTimeout";

describe("Employees courses e2e", () => {
  it("adds, edits, and removes an employee course", async () => {
    const browserContext = await browser.createBrowserContext();
    const browserPage = await browserContext.newPage();

    try {
      await signUpAndLoginAsAdmin(browserPage);
      await browserPage.goto(`${baseUrl}/dashboard/employees`, {
        waitUntil: "networkidle2",
      });

      const added = await addEmployeeViaModal(browserPage, "Course Candidate");
      await searchEmployeeByName(browserPage, added.fullName);

      const employeeCell = await browserPage.waitForSelector(
        `xpath///td[normalize-space()='${added.fullName}']`,
      );
      if (!employeeCell) {
        throw new Error("Added employee row not found");
      }
      await employeeCell.click();

      await clickByText(browserPage, "Update Record");
      await browserPage.waitForSelector("text/Add Course");

      await browserPage.type(
        "xpath///label[normalize-space()='Course Name']/following::input[1]",
        "Automation Course",
      );
      await browserPage.type(
        "xpath///label[normalize-space()='Units Completed']/following::input[1]",
        "12",
      );
      await clickByText(browserPage, "Add Course");
      await waitForTimeout(1_000);
      await browserPage.waitForSelector("text/Automation Course");

      const editButton = await browserPage.waitForSelector(
        "xpath///div[.//*[normalize-space()='Automation Course']]//button[.//*[contains(@class,'lucide-pencil')]]",
      );
      if (!editButton) {
        throw new Error("Course edit button not found");
      }
      await editButton.click();
      await browserPage.waitForSelector("text/Edit Mode");

      const editUnitsInput = await browserPage.waitForSelector(
        "xpath///div[.//*[normalize-space()='Edit Mode']]//label[normalize-space()='Units Completed']/following::input[1]",
      );
      if (!editUnitsInput) {
        throw new Error("Edit course units input not found");
      }
      await editUnitsInput.click({ clickCount: 3 });
      await browserPage.keyboard.type("24");
      const saveCourseButton = await browserPage.waitForSelector(
        "xpath///div[.//*[contains(normalize-space(), 'Update Actions -')]]//button[normalize-space()='Save Course']",
      );
      if (!saveCourseButton) {
        throw new Error("Save Course button not found");
      }
      await saveCourseButton.click();
      await browserPage.waitForSelector("text/Units: 24", { timeout: 60_000 });

      browserPage.once("dialog", async (dialog) => {
        await dialog.accept();
      });

      const deleteButton = await browserPage.waitForSelector(
        "xpath///div[.//*[normalize-space()='Automation Course']]//button[.//*[contains(@class,'lucide-trash2')]]",
      );
      if (!deleteButton) {
        throw new Error("Course delete button not found");
      }
      await deleteButton.click();

      await browserPage.waitForSelector("text/Course removed successfully.");

      await browserPage.click("button[aria-label='close modal']");
      await clickByText(browserPage, "Delete Record");
      await clickByText(browserPage, "Confirm");
      await browserPage.waitForSelector("text/Confirm Record Deletion", {
        hidden: true,
      });
    } finally {
      await browserContext.close();
    }
  }, 300_000);
});
