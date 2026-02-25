/// <reference types="vitest-puppeteer" />
import type { Page } from "puppeteer";
import createE2EUserSeed from "./createE2EUserSeed";

const baseUrl = process.env.PUPPETEER_BASE_URL ?? "http://127.0.0.1:5173";

export async function clickByText(browserPage: Page, label: string) {
  const element = await browserPage.waitForSelector(
    `xpath///*[self::button or self::a][normalize-space()='${label}' or contains(normalize-space(.), '${label}')]`,
  );

  if (!element) {
    throw new Error(`Clickable element not found: ${label}`);
  }

  await element.click();
}

async function completeSignup(browserPage: Page, user: ReturnType<typeof createE2EUserSeed>) {
  await browserPage.goto(`${baseUrl}/signup`, { waitUntil: "networkidle2" });
  await browserPage.waitForSelector("#employeeNumber");

  await browserPage.type("#employeeNumber", user.employeeNumber);
  await browserPage.type("#firstName", user.firstName);
  await browserPage.type("#lastName", user.lastName);
  await browserPage.type("#depedEmail", user.depedEmail);

  await clickByText(browserPage, "Next");
  await browserPage.waitForSelector("#address");

  await clickByText(browserPage, "Next");
  await browserPage.waitForSelector("#designation");

  await browserPage.type("#designation", "Teacher I");
  await browserPage.type("#employmentStatus", "Permanent");

  await clickByText(browserPage, "Next");
  await browserPage.waitForSelector("#password");

  await browserPage.type("#password", user.password);
  await browserPage.type("#confirmPassword", user.password);

  await clickByText(browserPage, "Create Admin Account");
  await browserPage.waitForFunction(() => window.location.pathname === "/login", {
    timeout: 30_000,
  });
}

async function completeLogin(browserPage: Page, user: ReturnType<typeof createE2EUserSeed>) {
  await browserPage.waitForSelector("#deped-email", { timeout: 30_000 });
  await browserPage.type("#deped-email", user.depedEmail);
  await browserPage.type("#password", user.password);

  await clickByText(browserPage, "Sign In");
  await browserPage.waitForFunction(
    () => window.location.pathname.startsWith("/dashboard"),
    { timeout: 12_000 },
  );
}

export async function signUpAndLoginAsAdmin(browserPage: Page) {
  const user = createE2EUserSeed();

  await completeSignup(browserPage, user);
  await completeLogin(browserPage, user);

  return user;
}

export { baseUrl };
