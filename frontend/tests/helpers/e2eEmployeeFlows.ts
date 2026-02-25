/// <reference types="vitest-puppeteer" />
import type { Page } from "puppeteer";
import createE2EUserSeed from "./createE2EUserSeed";
import { clickByText } from "./e2eAuthSession";

export async function addEmployeeViaModal(browserPage: Page, fullName = "E2E Employee") {
  const seed = createE2EUserSeed();
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ") || "Employee";

  const addButton = await browserPage.waitForSelector("button:has(svg.lucide-plus)");
  if (!addButton) {
    throw new Error("Add employee button not found");
  }

  await addButton.click();
  await browserPage.waitForSelector("text/Add New Employee");

  await browserPage.type("#employee_number", seed.employeeToAddNumber);
  await browserPage.type("#first_name", firstName);
  await browserPage.type("#last_name", lastName);

  const addEmployeeFormSelector =
    "xpath///form[.//*[contains(normalize-space(), 'Add New Employee')]]";

  const addModalNext1 = await browserPage.waitForSelector(
    `${addEmployeeFormSelector}//button[normalize-space()='Next']`,
  );
  if (!addModalNext1) {
    throw new Error("Add Employee modal button not found: Next");
  }
  await addModalNext1.click();

  await browserPage.type("#deped_email", `e2e.added.${Date.now()}@deped.gov.ph`);

  const addModalNext2 = await browserPage.waitForSelector(
    `${addEmployeeFormSelector}//button[normalize-space()='Next']`,
  );
  if (!addModalNext2) {
    throw new Error("Add Employee modal button not found: Next");
  }
  await addModalNext2.click();

  await browserPage.type("#designation", "Teacher I");
  await browserPage.type("#employment_status", "Permanent");

  for (let step = 0; step < 8; step += 1) {
    const saveButton = await browserPage.$(
      `${addEmployeeFormSelector}//button[normalize-space()='Save Employee']`,
    );

    if (saveButton) {
      await saveButton.click();
      break;
    }

    const addModalNext = await browserPage.waitForSelector(
      `${addEmployeeFormSelector}//button[normalize-space()='Next']`,
    );
    if (!addModalNext) {
      throw new Error("Add Employee modal button not found: Next");
    }
    await addModalNext.click();

    if (step === 7) {
      throw new Error("Could not reach Save Employee button in Add Employee modal.");
    }
  }

  await browserPage.waitForSelector("#employee_number", {
    hidden: true,
    timeout: 120_000,
  });

  return {
    employeeNumber: Number(seed.employeeToAddNumber),
    fullName,
    firstName,
    lastName,
  };
}

export async function searchEmployeeByName(browserPage: Page, name: string) {
  await browserPage.click("input[placeholder='Search full name...']", {
    clickCount: 3,
  });
  await browserPage.keyboard.type(name);
  await clickByText(browserPage, "Search");
}

export async function openProfileMenuAndSignOut(browserPage: Page) {
  let opened = false;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const settingsButtons = await browserPage.$$("button");
    for (const button of settingsButtons) {
      const text = await browserPage.evaluate(
        (node) => (node.textContent ?? "").trim(),
        button,
      );
      if (text !== "") {
        continue;
      }
      await button.click().catch(() => undefined);
      const signOutOption = await browserPage.$(
        "xpath///*[self::button or self::a][normalize-space()='Sign out' or contains(normalize-space(.), 'Sign out')]",
      );
      if (signOutOption) {
        opened = true;
        break;
      }
    }
    if (opened) {
      break;
    }
    await browserPage.waitForTimeout(300);
  }
  if (!opened) {
    throw new Error("Profile settings menu did not open");
  }

  await clickByText(browserPage, "Sign out");
  await browserPage.waitForFunction(() => {
    const pathname = window.location.pathname;
    return pathname === "/login" || pathname.startsWith("/dashboard/");
  }, {
    timeout: 15_000,
  });
}
