import { describe, expect, it } from "vitest";
import {
  toNullableNumber,
  validateCourseForm,
  validateEmployeeForm,
} from "@/pages/EmployeeDashboard/utils";
import type { Course } from "@/domain/employees/types";
import type {
  CourseFormState,
  EmployeeFormState,
} from "@/pages/EmployeeDashboard/types";

function createEmployeeFormState(
  overrides: Partial<EmployeeFormState> = {},
): EmployeeFormState {
  return {
    employee_number: "20251",
    first_name: "Admin",
    middle_name: "",
    last_name: "Account",
    deped_email: "admin@example.com",
    designation: "Teacher I",
    date_joined: "2020-01-01",
    date_of_latest_promotion: "",
    contact_number: "",
    plantilla_number: "",
    date_of_original_appointment: "",
    bp_number: "",
    address: "",
    civil_status: "",
    date_of_birth: "1990-01-01",
    salary_grade: "11",
    salary: "25000",
    employment_status: "Permanent",
    tin: "",
    place_of_birth: "",
    ...overrides,
  };
}

describe("EmployeeDashboard utils", () => {
  it("toNullableNumber handles whitespace and invalid numeric input", () => {
    expect(toNullableNumber("  ")).toBeNull();
    expect(toNullableNumber("not-a-number")).toBeNull();
    expect(toNullableNumber(" 25000 ")).toBe(25000);
  });

  it("validateEmployeeForm returns errors for invalid date and non-numeric values", () => {
    const errors = validateEmployeeForm(
      createEmployeeFormState({
        employee_number: "id-1",
        salary_grade: "11x",
        salary: "abc",
        date_joined: "2026/01/01",
      }),
    );

    expect(errors.employee_number).toBe("Employee number must be numeric.");
    expect(errors.salary_grade).toBe("Salary grade must be numeric.");
    expect(errors.salary).toBe("Salary must be numeric.");
    expect(errors.date_joined).toBe("Invalid date.");
  });

  it("validateCourseForm detects duplicate courses case-insensitively", () => {
    const courses: Course[] = [
      {
        employee_number: 1,
        course_name: "Master of Arts in Education",
        degree_level: "master",
        units_completed: 30,
        is_finished: 0,
      },
    ];

    const form: CourseFormState = {
      course_name: "  master of arts in education ",
      degree_level: "master",
      units_completed: "15",
      is_finished: false,
    };

    const errors = validateCourseForm(form, courses);
    expect(errors.course_name).toBe("Duplicate course for this employee.");
  });

  it("validateCourseForm allows the same course while editing", () => {
    const courses: Course[] = [
      {
        employee_number: 1,
        course_name: "Master of Arts in Education",
        degree_level: "master",
        units_completed: 30,
        is_finished: 0,
      },
    ];

    const form: CourseFormState = {
      course_name: "Master of Arts in Education",
      degree_level: "master",
      units_completed: "15",
      is_finished: false,
    };

    const errors = validateCourseForm(
      form,
      courses,
      "master of arts in education::master",
    );
    expect(errors.course_name).toBeUndefined();
  });
});
