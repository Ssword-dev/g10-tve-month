/// <reference types="vitest-puppeteer" />
import { describe, expect, it } from "vitest";
import createE2EUserSeed from "../helpers/createE2EUserSeed";

const baseUrl = process.env.PUPPETEER_BASE_URL ?? "http://127.0.0.1:5173";

describe.sequential("Whole app journey e2e", () => {
  const user = createE2EUserSeed();

  it("signs up, logs in, manages employees, toggles theme, and signs out", async () => {
    await page.goto(`${baseUrl}/signup`, { waitUntil: "networkidle2" });
    await page.waitForSelector("#employeeNumber");

    await page.type("#employeeNumber", user.employeeNumber);
    await page.type("#firstName", user.firstName);
    await page.type("#lastName", user.lastName);
    await page.type("#depedEmail", user.depedEmail);

    const nextButton1 = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Next' or contains(normalize-space(.), 'Next')]",
    );
    if (!nextButton1) {
      throw new Error("Clickable element not found: Next");
    }
    await nextButton1.click();
    await page.waitForSelector("#address");
    const nextButton2 = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Next' or contains(normalize-space(.), 'Next')]",
    );
    if (!nextButton2) {
      throw new Error("Clickable element not found: Next");
    }
    await nextButton2.click();
    await page.waitForSelector("#designation");
    await page.type("#designation", "Teacher I");
    await page.type("#employmentStatus", "Permanent");
    const nextButton3 = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Next' or contains(normalize-space(.), 'Next')]",
    );
    if (!nextButton3) {
      throw new Error("Clickable element not found: Next");
    }
    await nextButton3.click();
    await page.waitForSelector("#password");
    await page.type("#password", user.password);
    await page.type("#confirmPassword", user.password);

    const createAdminButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Create Admin Account' or contains(normalize-space(.), 'Create Admin Account')]",
    );
    if (!createAdminButton) {
      throw new Error("Clickable element not found: Create Admin Account");
    }
    await createAdminButton.click();
    await page.waitForFunction(() => window.location.pathname === "/login", {
      timeout: 30_000,
    });
    await page.waitForSelector("#deped-email", { timeout: 30_000 });

    await page.type("#deped-email", user.depedEmail);
    await page.type("#password", user.password);
    const signInButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Sign In' or contains(normalize-space(.), 'Sign In')]",
    );
    if (!signInButton) {
      throw new Error("Clickable element not found: Sign In");
    }
    await signInButton.click();
    await page.waitForFunction(
      () => window.location.pathname.startsWith("/dashboard"),
      { timeout: 12_000 },
    );
    await page.goto(`${baseUrl}/dashboard/overview`, { waitUntil: "networkidle2" });
    await page.waitForSelector("text/Employee Summary");

    await page.goto(`${baseUrl}/dashboard/employees`, { waitUntil: "networkidle2" });
    await page.waitForSelector("input[placeholder='Search full name...']");

    await page.type(
      "input[placeholder='Search full name...']",
      "Juan Dela Cruz",
    );
    const fullNameSearchButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Search' or contains(normalize-space(.), 'Search')]",
    );
    if (!fullNameSearchButton) {
      throw new Error("Clickable element not found: Search");
    }
    await fullNameSearchButton.click();
    await page.waitForSelector("text/Juan Dela Cruz");
    const clearAfterFullNameSearch = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Clear' or contains(normalize-space(.), 'Clear')]",
    );
    if (!clearAfterFullNameSearch) {
      throw new Error("Clickable element not found: Clear");
    }
    await clearAfterFullNameSearch.click();

    await page.type(
      "input[placeholder='Search full name...']",
      "name-not-found",
    );
    const searchButton1 = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Search' or contains(normalize-space(.), 'Search')]",
    );
    if (!searchButton1) {
      throw new Error("Clickable element not found: Search");
    }
    await searchButton1.click();
    await page.waitForSelector("text/No employees found.");
    const clearButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Clear' or contains(normalize-space(.), 'Clear')]",
    );
    if (!clearButton) {
      throw new Error("Clickable element not found: Clear");
    }
    await clearButton.click();

    const addButton = await page.waitForSelector("button:has(svg.lucide-plus)");
    if (!addButton) {
      throw new Error("Add employee button not found");
    }
    await addButton.click();
    await page.waitForSelector("text/Add New Employee");

    await page.type("#employee_number", user.employeeToAddNumber);
    await page.type("#first_name", "E2E");
    await page.type("#last_name", "Employee");
    const addModalNext1 = await page.waitForSelector(
      "xpath///form[.//*[contains(normalize-space(), 'Add New Employee')]]//button[normalize-space()='Next']",
    );
    if (!addModalNext1) {
      throw new Error("Add Employee modal button not found: Next");
    }
    await addModalNext1.click();
    await page.type("#deped_email", `admin-${Date.now()}@deped.gov.ph`);
    const addModalNext2 = await page.waitForSelector(
      "xpath///form[.//*[contains(normalize-space(), 'Add New Employee')]]//button[normalize-space()='Next']",
    );
    if (!addModalNext2) {
      throw new Error("Add Employee modal button not found: Next");
    }
    await addModalNext2.click();
    await page.type("#designation", "Teacher I");
    await page.type("#employment_status", "Permanent");

    const addEmployeeFormSelector =
      "xpath///form[.//*[contains(normalize-space(), 'Add New Employee')]]";

    for (let step = 0; step < 8; step += 1) {
      const saveButton = await page.$(
        `${addEmployeeFormSelector}//button[normalize-space()='Save Employee']`,
      );
      if (saveButton) {
        const buttonLabel = await page.evaluate(
          (button) => button.textContent?.trim(),
          saveButton,
        );
        if (buttonLabel !== "Save Employee") {
          throw new Error(
            `Unexpected submit button label in Add Employee modal: ${buttonLabel ?? "unknown"}`,
          );
        }
        await saveButton.click();
        break;
      }

      const addModalNext = await page.waitForSelector(
        `${addEmployeeFormSelector}//button[normalize-space()='Next']`,
      );
      if (!addModalNext) {
        throw new Error("Add Employee modal button not found: Next");
      }
      await addModalNext.click();

      if (step === 7) {
        throw new Error(
          "Could not reach Save Employee button in Add Employee modal.",
        );
      }
    }

    await page.waitForSelector("#employee_number", {
      hidden: true,
      timeout: 120_000,
    });
    await page.click("input[placeholder='Search full name...']", {
      clickCount: 3,
    });
    await page.keyboard.type("E2E Employee");
    const searchButton2 = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Search' or contains(normalize-space(.), 'Search')]",
    );
    if (!searchButton2) {
      throw new Error("Clickable element not found: Search");
    }
    await searchButton2.click();
    await page.waitForSelector("text/E2E Employee");

    const employeeCell = await page.waitForSelector(
      "xpath///td[normalize-space()='E2E Employee']",
    );
    if (!employeeCell) {
      throw new Error("Added employee row not found");
    }
    await employeeCell.click();

    await page.waitForSelector("text/Employee #");
    const deleteRecordButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Delete Record' or contains(normalize-space(.), 'Delete Record')]",
    );
    if (!deleteRecordButton) {
      throw new Error("Clickable element not found: Delete Record");
    }
    await deleteRecordButton.click();
    await page.waitForSelector("text/Confirm Record Deletion");
    const confirmButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Confirm' or contains(normalize-space(.), 'Confirm')]",
    );
    if (!confirmButton) {
      throw new Error("Clickable element not found: Confirm");
    }
    await confirmButton.click();
    await page.waitForSelector("text/Confirm Record Deletion", {
      hidden: true,
    });

    await page.click("input[placeholder='Search full name...']", {
      clickCount: 3,
    });
    await page.keyboard.type("E2E Employee");
    const searchButton3 = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Search' or contains(normalize-space(.), 'Search')]",
    );
    if (!searchButton3) {
      throw new Error("Clickable element not found: Search");
    }
    await searchButton3.click();
    await page.goto(`${baseUrl}/dashboard/settings/appearance`, {
      waitUntil: "networkidle2",
    });

    await page.waitForFunction(
      () => window.location.pathname === "/dashboard/settings/appearance",
      { timeout: 10_000 },
    );
    const darkModeButton = await page.waitForSelector(
      "xpath///button[contains(normalize-space(.), 'Dark Mode')]",
      { timeout: 10_000 },
    );
    if (!darkModeButton) {
      throw new Error("Dark Mode button not found");
    }
    await darkModeButton.click();
    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(hasDarkClass).toBe(true);
    const backToSettingsButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Back to Settings' or contains(normalize-space(.), 'Back to Settings')]",
    );
    if (!backToSettingsButton) {
      throw new Error("Clickable element not found: Back to Settings");
    }
    await backToSettingsButton.click();

    const settingsButtons = await page.$$("button:has(svg.lucide-settings)");
    const profileSettingsButton = settingsButtons.at(-1);
    if (!profileSettingsButton) {
      throw new Error("Profile settings trigger not found");
    }
    await profileSettingsButton.click();
    await page.waitForSelector("text/Sign out");
    const signOutButton = await page.waitForSelector(
      "xpath///*[self::button or self::a][normalize-space()='Sign out' or contains(normalize-space(.), 'Sign out')]",
    );
    if (!signOutButton) {
      throw new Error("Clickable element not found: Sign out");
    }
    await signOutButton.click();
    await page.waitForFunction(() => window.location.pathname === "/login", {
      timeout: 10_000,
    });

    await page.goto(`${baseUrl}/dashboard/overview`, { waitUntil: "networkidle2" });
    await page.waitForFunction(
      () => window.location.pathname === "/dashboard/employees",
      { timeout: 10_000 },
    );
  }, 300_000);
});


