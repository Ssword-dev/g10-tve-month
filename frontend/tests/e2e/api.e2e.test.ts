/** @vitest-environment node */
import { describe, expect, it } from "vitest";

const baseUrl = process.env.VITEST_E2E_BASE_URL ?? "http://127.0.0.1:8000";

async function parseJsonResponse(response: Response) {
  const body = (await response.json()) as {
    type: "data" | "error" | "success";
    data?: unknown;
    message?: string;
  };
  return body;
}

describe("Backend API e2e", () => {
  it("returns guest-safe employee fields for unauthenticated getAllEmployees", async () => {
    const response = await fetch(`${baseUrl}/getAllEmployees`);
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(200);
    expect(body.type).toBe("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect((body.data as unknown[]).length).toBeGreaterThan(0);

    const firstEmployee = (body.data as Array<Record<string, unknown>>)[0];
    expect(firstEmployee).toHaveProperty("employee_number");
    expect(firstEmployee).toHaveProperty("full_name");
    expect(firstEmployee).not.toHaveProperty("deped_email");
  });

  it("returns 405 when getAllEmployees uses the wrong method", async () => {
    const response = await fetch(`${baseUrl}/getAllEmployees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(405);
    expect(body.type).toBe("error");
    expect(body.message).toContain("GET required");
  });

  it("returns 422 for invalid login payload edge case", async () => {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deped_email: "not-an-email",
        password: "any",
      }),
    });
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(422);
    expect(body.type).toBe("error");
    expect(body.message).toContain("valid email");
  });
});

