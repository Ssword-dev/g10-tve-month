import type { Employee } from "@/domain/employees/types";

export const employeeFields: { value: keyof Employee; label: string; type: string }[] = [
  { value: "first_name", label: "First Name", type: "string" },
  { value: "middle_name", label: "Middle Name", type: "string" },
  { value: "last_name", label: "Last Name", type: "string" },
  { value: "deped_email", label: "DepEd Email", type: "string" },
  { value: "employee_number", label: "Employee #", type: "number" },
  { value: "designation", label: "Designation", type: "string" },
  { value: "date_joined", label: "Date Joined", type: "date" },
  {
    value: "date_of_latest_promotion",
    label: "Latest Promotion",
    type: "date",
  },
  { value: "contact_number", label: "Contact #", type: "string" },
  { value: "plantilla_number", label: "Plantilla #", type: "string" },
  {
    value: "date_of_original_appointment",
    label: "Original Appointment",
    type: "date",
  },
  { value: "bp_number", label: "BP #", type: "number" },
  { value: "address", label: "Address", type: "string" },
  { value: "civil_status", label: "Civil Status", type: "string" },
  { value: "date_of_birth", label: "Date of Birth", type: "date" },
  { value: "salary_grade", label: "Salary Grade", type: "number" },
  { value: "salary", label: "Salary", type: "string" },
  { value: "employment_status", label: "Employment Status", type: "string" },
  { value: "tin", label: "TIN", type: "string" },
  { value: "place_of_birth", label: "Place of Birth", type: "string" },
];

export const numberOperators = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "gt", label: "greater than" },
  { value: "gte", label: "greater than or equal" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "less than or equal" },
  { value: "between", label: "between" },
];

export const stringOperators = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "contains", label: "contains" },
  { value: "startsWith", label: "starts with" },
  { value: "endsWith", label: "ends with" },
  { value: "in", label: "is any of" },
];

export const dateOperators = [
  { value: "eq", label: "on" },
  { value: "neq", label: "not on" },
  { value: "gt", label: "after" },
  { value: "gte", label: "on or after" },
  { value: "lt", label: "before" },
  { value: "lte", label: "on or before" },
  { value: "between", label: "between" },
];

export const booleanOperators = [
  { value: "eq", label: "is" },
  { value: "neq", label: "is not" },
];
