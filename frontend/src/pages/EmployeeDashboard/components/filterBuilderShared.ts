import type { Employee } from "@/domain/employees/types";

type EmployeeFieldType = "number" | "string" | "date" | "boolean";

type EmployeeFieldMeta = {
  value: keyof Employee;
  label: string;
  type: EmployeeFieldType;
  nullable: boolean;
};

export const employeeFields: EmployeeFieldMeta[] = [
  { value: "first_name", label: "First Name", type: "string", nullable: false },
  {
    value: "middle_name",
    label: "Middle Name",
    type: "string",
    nullable: true,
  },
  { value: "last_name", label: "Last Name", type: "string", nullable: false },
  {
    value: "deped_email",
    label: "DepEd Email",
    type: "string",
    nullable: true,
  },
  {
    value: "employee_number",
    label: "Employee #",
    type: "number",
    nullable: false,
  },
  {
    value: "designation",
    label: "Designation",
    type: "string",
    nullable: false,
  },
  { value: "date_joined", label: "Date Joined", type: "date", nullable: true },
  {
    value: "date_of_latest_promotion",
    label: "Latest Promotion",
    type: "date",
    nullable: true,
  },
  {
    value: "contact_number",
    label: "Contact #",
    type: "string",
    nullable: true,
  },
  {
    value: "plantilla_number",
    label: "Plantilla #",
    type: "string",
    nullable: true,
  },
  {
    value: "date_of_original_appointment",
    label: "Original Appointment",
    type: "date",
    nullable: true,
  },
  { value: "bp_number", label: "BP #", type: "number", nullable: true },
  { value: "address", label: "Address", type: "string", nullable: true },
  {
    value: "civil_status",
    label: "Civil Status",
    type: "string",
    nullable: true,
  },
  {
    value: "date_of_birth",
    label: "Date of Birth",
    type: "date",
    nullable: true,
  },
  {
    value: "salary_grade",
    label: "Salary Grade",
    type: "number",
    nullable: true,
  },
  { value: "salary", label: "Salary", type: "number", nullable: true },
  { value: "age", label: "Age", type: "number", nullable: true },
  {
    value: "employment_status",
    label: "Employment Status",
    type: "string",
    nullable: false,
  },
  { value: "tin", label: "TIN", type: "string", nullable: true },
  {
    value: "place_of_birth",
    label: "Place of Birth",
    type: "string",
    nullable: true,
  },
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

export type { EmployeeFieldType, EmployeeFieldMeta };
