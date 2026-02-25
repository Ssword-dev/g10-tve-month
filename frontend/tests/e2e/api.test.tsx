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

function buildTempEmployeeNumber() {
  return 950000 + (Date.now() % 10000);
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

  it("returns 401 for wrong login credentials", async () => {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deped_email: "missing.admin@deped.gov.ph",
        password: "wrong-password",
      }),
    });
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(401);
    expect(body.type).toBe("error");
    expect(body.message).toContain("Invalid deped_email or password");
  });

  it("filters by full name using first and last name text", async () => {
    const response = await fetch(`${baseUrl}/filterEmployees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        where: {
          field: "full_name",
          comparisons: [{ type: "contains", operand: "Juan Dela Cruz" }],
        },
      }),
    });
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(200);
    expect(body.type).toBe("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect((body.data as Array<Record<string, unknown>>).length).toBeGreaterThan(0);

    const employeeNumbers = (body.data as Array<Record<string, unknown>>)
      .map((item) => Number(item.employee_number))
      .filter((item) => Number.isFinite(item));
    expect(employeeNumbers).toContain(10001);
  });

  it("returns structured employee details for a valid employee number", async () => {
    const response = await fetch(`${baseUrl}/getEmployee?employee_number=10001`);
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(200);
    expect(body.type).toBe("data");
    expect(body.data).toMatchObject({
      employee_number: 10001,
      first_name: "Juan",
      last_name: "Dela Cruz",
    });
  });

  it("supports filter pagination limits", async () => {
    const response = await fetch(`${baseUrl}/filterEmployees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        limit: 3,
        page: 1,
      }),
    });
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(200);
    expect(body.type).toBe("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect((body.data as unknown[]).length).toBeLessThanOrEqual(3);
  });

  it("supports field include selection in filter results", async () => {
    const response = await fetch(`${baseUrl}/filterEmployees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          include: ["full_name"],
        },
        limit: 1,
      }),
    });
    const body = await parseJsonResponse(response);

    expect(response.status).toBe(200);
    expect(body.type).toBe("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect((body.data as unknown[]).length).toBeGreaterThan(0);

    const firstEmployee = (body.data as Array<Record<string, unknown>>)[0];
    expect(firstEmployee).toHaveProperty("full_name");
    expect(firstEmployee).toHaveProperty("employee_number");
    expect(firstEmployee).not.toHaveProperty("deped_email");
    expect(firstEmployee).not.toHaveProperty("designation");
  });

  it("returns an error for invalid employee number input", async () => {
    const response = await fetch(`${baseUrl}/getEmployee?employee_number=invalid`);
    const body = await parseJsonResponse(response);

    expect(body.type).toBe("error");
    expect(body.message).toContain("Invalid employee number");
  });

  it("supports add/update/delete employee lifecycle with invalid payload checks", async () => {
    const employeeNumber = buildTempEmployeeNumber();

    const invalidAddResponse = await fetch(`${baseUrl}/addEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        first_name: "Api",
      }),
    });
    const invalidAddBody = await parseJsonResponse(invalidAddResponse);

    expect(invalidAddResponse.status).toBe(400);
    expect(invalidAddBody.type).toBe("error");
    expect(invalidAddBody.message).toContain("required");

    const addResponse = await fetch(`${baseUrl}/addEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        first_name: "Api",
        middle_name: "",
        last_name: "Employee",
        deped_email: `api.employee.${employeeNumber}@deped.gov.ph`,
        designation: "Teacher I",
        employment_status: "Permanent",
        courses: [],
      }),
    });
    const addBody = await parseJsonResponse(addResponse);

    expect(addResponse.status).toBe(201);
    expect(addBody.type).toBe("success");

    const invalidUpdateResponse = await fetch(`${baseUrl}/updateEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        salary_grade: "not-number",
      }),
    });
    const invalidUpdateBody = await parseJsonResponse(invalidUpdateResponse);

    expect(invalidUpdateResponse.status).toBe(422);
    expect(invalidUpdateBody.type).toBe("error");
    expect(invalidUpdateBody.message).toContain("Invalid numeric value");

    const updateResponse = await fetch(`${baseUrl}/updateEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        designation: "Teacher II",
        salary_grade: 12,
      }),
    });
    const updateBody = await parseJsonResponse(updateResponse);

    expect(updateResponse.status).toBe(200);
    expect(updateBody.type).toBe("data");
    expect(updateBody.data).toMatchObject({
      employee_number: employeeNumber,
      designation: "Teacher II",
    });

    const deleteResponse = await fetch(`${baseUrl}/deleteEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_number: employeeNumber }),
    });
    const deleteBody = await parseJsonResponse(deleteResponse);

    expect(deleteResponse.status).toBe(200);
    expect(deleteBody.type).toBe("success");
  });

  it("supports add/update/delete course lifecycle with invalid payload checks", async () => {
    const employeeNumber = buildTempEmployeeNumber();

    const addEmployeeResponse = await fetch(`${baseUrl}/addEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        first_name: "Course",
        middle_name: "",
        last_name: "Owner",
        deped_email: `api.course.${employeeNumber}@deped.gov.ph`,
        designation: "Teacher I",
        employment_status: "Permanent",
        courses: [],
      }),
    });
    expect(addEmployeeResponse.status).toBe(201);

    const invalidAddCourseResponse = await fetch(`${baseUrl}/addCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        course_name: "",
        degree_level: "master",
      }),
    });
    const invalidAddCourseBody = await parseJsonResponse(invalidAddCourseResponse);
    expect(invalidAddCourseResponse.status).toBe(422);
    expect(invalidAddCourseBody.type).toBe("error");
    expect(invalidAddCourseBody.message).toContain("required");

    const addCourseResponse = await fetch(`${baseUrl}/addCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        course_name: "Automation Course",
        degree_level: "master",
        units_completed: 12,
        is_finished: 0,
      }),
    });
    const addCourseBody = await parseJsonResponse(addCourseResponse);
    expect(addCourseResponse.status).toBe(200);
    expect(addCourseBody.type).toBe("data");

    const invalidUpdateCourseResponse = await fetch(`${baseUrl}/updateCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        original_course_name: "Automation Course",
        original_degree_level: "master",
        course_name: "Automation Course",
        degree_level: "invalid",
      }),
    });
    const invalidUpdateCourseBody = await parseJsonResponse(
      invalidUpdateCourseResponse,
    );
    expect(invalidUpdateCourseResponse.status).toBe(422);
    expect(invalidUpdateCourseBody.type).toBe("error");

    const updateCourseResponse = await fetch(`${baseUrl}/updateCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        original_course_name: "Automation Course",
        original_degree_level: "master",
        course_name: "Automation Course",
        degree_level: "master",
        units_completed: 24,
        is_finished: 1,
      }),
    });
    const updateCourseBody = await parseJsonResponse(updateCourseResponse);
    expect(updateCourseResponse.status).toBe(200);
    expect(updateCourseBody.type).toBe("data");
    expect(updateCourseBody.data).toMatchObject({
      course_name: "Automation Course",
      units_completed: 24,
      is_finished: 1,
    });

    const deleteCourseResponse = await fetch(`${baseUrl}/deleteCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_number: employeeNumber,
        course_name: "Automation Course",
        degree_level: "master",
      }),
    });
    const deleteCourseBody = await parseJsonResponse(deleteCourseResponse);
    expect(deleteCourseResponse.status).toBe(200);
    expect(deleteCourseBody.type).toBe("success");

    await fetch(`${baseUrl}/deleteEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_number: employeeNumber }),
    });
  });
});
