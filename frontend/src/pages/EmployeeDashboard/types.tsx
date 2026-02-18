import type z from "zod";
import type { employeeFormSchema, courseFormSchema } from "./schemas";

type EmployeeFormState = z.output<typeof employeeFormSchema>;
type CourseFormState = z.output<typeof courseFormSchema>;

type FieldErrorMap = Record<
  keyof EmployeeFormState | keyof CourseFormState,
  string | undefined
>;

export type { EmployeeFormState, CourseFormState, FieldErrorMap };
