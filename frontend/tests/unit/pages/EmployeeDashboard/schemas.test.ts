import {
  courseFormSchema,
  createEmployeeSchema,
  dateSchema,
  employeeFormSchema,
  numericStringSchema,
  updateEmployeeSchema,
} from "@/pages/EmployeeDashboard/schemas";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("EmployeeDashboard schemas", () => {
  it("validates employee create payload", () => {
    const parsed = createEmployeeSchema.safeParse({
      employee_number: "20001",
      first_name: "E2E",
      middle_name: "",
      last_name: "User",
      deped_email: "e2e.user@deped.gov.ph",
      designation: "Teacher I",
      employment_status: "Permanent",
      date_joined: "2025-01-01",
      date_of_latest_promotion: "",
      contact_number: "",
      plantilla_number: "",
      date_of_original_appointment: "",
      bp_number: "",
      address: "",
      civil_status: "",
      date_of_birth: "",
      salary_grade: "11",
      salary: "25000",
      tin: "",
      place_of_birth: "",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid employee values", () => {
    const parsed = createEmployeeSchema.safeParse({
      employee_number: "0",
      first_name: "",
      last_name: "",
      deped_email: "bad-email",
      designation: "",
      employment_status: "",
      date_joined: "2025/01/01",
      salary_grade: "35",
      salary: "-1",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const message = JSON.stringify(parsed.error.flatten().fieldErrors);
      expect(message).toContain("Employee number");
      expect(message).toContain("First name is required");
      expect(message).toContain("Invalid email format");
    }
  });

  it("validates update employee schema requiring numeric employee number", () => {
    expect(
      updateEmployeeSchema.safeParse({
        employee_number: 20001,
        first_name: "A",
        middle_name: "",
        last_name: "B",
        deped_email: "",
        designation: "Teacher",
        date_joined: "",
        date_of_latest_promotion: "",
        contact_number: "",
        plantilla_number: "",
        date_of_original_appointment: "",
        bp_number: "",
        address: "",
        civil_status: "",
        date_of_birth: "",
        salary_grade: "",
        salary: "",
        employment_status: "Permanent",
        tin: "",
        place_of_birth: "",
      }).success,
    ).toBe(true);

    expect(
      updateEmployeeSchema.safeParse({ employee_number: 0 }).success,
    ).toBe(false);
  });

  it("validates course form edge cases", () => {
    expect(
      courseFormSchema.safeParse({
        course_name: "Master of Arts",
        degree_level: "master",
        units_completed: "30",
        is_finished: true,
      }).success,
    ).toBe(true);

    expect(
      courseFormSchema.safeParse({
        course_name: "",
        degree_level: "x",
        units_completed: "abc",
        is_finished: false,
      }).success,
    ).toBe(false);
  });

  it("checks standalone date and numeric schema utilities", () => {
    expect(dateSchema.safeParse("2025-01-01").success).toBe(true);
    expect(dateSchema.safeParse("2025/01/01").success).toBe(false);

    const salaryGradeSchema = numericStringSchema(z.number().int().min(1).max(33));
    expect(salaryGradeSchema.safeParse("11").success).toBe(true);
    expect(salaryGradeSchema.safeParse("11a").success).toBe(false);

    expect(employeeFormSchema.safeParse({}).success).toBe(false);
  });
});
