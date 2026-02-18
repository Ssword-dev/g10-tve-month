import type { Employee } from "@/domain/employees/types";
import type { AdminSessionResponse } from "./actions";

type AuthRole = "admin" | "guest";

type EmployeeField = keyof Employee;

const guestEmployeeFields: EmployeeField[] = [
  "employee_number",
  "first_name",
  "middle_name",
  "last_name",
  "designation",
  "employment_status",
  "date_joined",
];

function getAuthRole(session: AdminSessionResponse | null | undefined): AuthRole {
  if (session?.authenticated) {
    return "admin";
  }

  return "guest";
}

function isAuthenticated(session: AdminSessionResponse | null | undefined): boolean {
  return getAuthRole(session) === "admin";
}

function canManageEmployees(session: AdminSessionResponse | null | undefined): boolean {
  return isAuthenticated(session);
}

function getVisibleEmployeeFields(role: AuthRole): EmployeeField[] | "ALL" {
  if (role === "admin") {
    return "ALL";
  }

  return guestEmployeeFields;
}

function getFilterableEmployeeFields(role: AuthRole): EmployeeField[] {
  if (role === "admin") {
    return [
      "employee_number",
      "first_name",
      "middle_name",
      "last_name",
      "deped_email",
      "designation",
      "date_joined",
      "date_of_latest_promotion",
      "contact_number",
      "plantilla_number",
      "date_of_original_appointment",
      "bp_number",
      "address",
      "civil_status",
      "date_of_birth",
      "salary_grade",
      "salary",
      "employment_status",
      "tin",
      "place_of_birth",
    ];
  }

  return guestEmployeeFields;
}

export type { AuthRole };
export {
  guestEmployeeFields,
  getAuthRole,
  isAuthenticated,
  canManageEmployees,
  getVisibleEmployeeFields,
  getFilterableEmployeeFields,
};
