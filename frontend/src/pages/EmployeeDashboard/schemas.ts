import { z } from "zod";

// Degree level enum
const degreeLevelSchema = z.enum(["bachelor", "master", "doctorate"]);

// Date validation (empty or YYYY-MM-DD format)
const dateSchema = z
  .string()
  .refine(
    (val) => val === "" || /^\d{4}-\d{2}-\d{2}$/.test(val),
    "Invalid date format. Use YYYY-MM-DD.",
  );

// Numeric string validation (empty or digits only)
const numericStringSchema = (schema: z.ZodNumber) =>
  z
    .string()
    .default("")
    .refine((val) => val === "" || /^\d+$/.test(val), "Must be numeric.")
    .refine(
      (val) => val === "" || schema.safeParse(Number(val)).success,
      "Value is out of range.",
    );

// Employee Form Schema (for adding/updating)
const employeeFormSchema = z.object({
  employee_number: z
    .string()
    .default("")
    .refine((val) => val === "" || /^\d+$/.test(val), "Employee number must be numeric.")
    .refine((val) => val === "" || Number(val) > 0, "Employee number must be positive."),
  first_name: z.string().min(1, "First name is required."),
  middle_name: z.string().optional().default(""),
  last_name: z.string().min(1, "Last name is required."),
  deped_email: z
    .string()
    .trim()
    .email("Invalid email format")
    .or(z.literal(""))
    .default(""),
  designation: z.string().min(1, "Designation is required."),
  date_joined: dateSchema.optional().default(""),
  date_of_latest_promotion: dateSchema.optional().default(""),
  contact_number: z.string().optional().default(""),
  plantilla_number: z.string().optional().default(""),
  date_of_original_appointment: dateSchema.optional().default(""),
  bp_number: z
    .string()
    .default("")
    .refine((val) => val.length <= 30, "BP number must be at most 30 characters."),
  address: z.string().optional().default(""),
  civil_status: z.string().optional().default(""),
  date_of_birth: dateSchema.optional().default(""),
  salary_grade: numericStringSchema(
    z
      .number()
      .int()
      .min(1, "Salary grade must be at least 1")
      .max(33, "Salary grade cannot exceed 33"),
  ),
  salary: numericStringSchema(
    z.number().int().min(0, "Salary cannot be negative."),
  ),
  employment_status: z.string().min(1, "Employment status is required."),
  tin: z.string().optional().default(""),
  place_of_birth: z.string().optional().default(""),
});

// Course Form Schema
const courseFormSchema = z.object({
  course_name: z.string().min(1, "Course name is required."),
  degree_level: degreeLevelSchema,
  units_completed: numericStringSchema(
    z
      .number()
      .int()
      .min(0, "Units cannot be negative")
      .max(100, "Maximum units exceeded"),
  ),
  is_finished: z.boolean().default(false),
});

// Separate schema for creating employee (employee_number required)
const createEmployeeSchema = employeeFormSchema.extend({
  employee_number: z
    .string()
    .min(1, "Employee number is required.")
    .regex(/^\d+$/, "Employee number must be numeric.")
    .refine((val) => Number(val) > 0, "Employee number must be positive."),
});

// Separate schema for updating employee (requires employee_number)
const updateEmployeeSchema = employeeFormSchema.extend({
  employee_number: z.number().int().positive("Employee number is required"),
});

export {
  degreeLevelSchema,
  dateSchema,
  numericStringSchema,
  employeeFormSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  courseFormSchema,
};
