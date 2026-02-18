import type { EmployeeUpdatePayload } from "@/domain/employees/payloads";
import type { Course, Employee } from "@/domain/employees/types";
import type {
  CourseFormState,
  EmployeeFormState,
  FieldErrorMap,
} from "./types";

function toInputDate(value: string | null | undefined): string {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toNullableString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function isValidDateOrEmpty(value: string): boolean {
  if (value.trim() === "") return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
}

function courseKey(
  course: Pick<Course, "course_name" | "degree_level">,
): string {
  return `${course.course_name.trim().toLowerCase()}::${course.degree_level}`;
}

function emptyCourseForm(): CourseFormState {
  return {
    course_name: "",
    degree_level: "bachelor",
    units_completed: "",
    is_finished: false,
  };
}

function toEmployeeFormState(employee: Employee): EmployeeFormState {
  return {
    first_name: employee.first_name ?? "",
    middle_name: employee.middle_name ?? "",
    last_name: employee.last_name ?? "",
    deped_email: employee.deped_email ?? "",
    designation: employee.designation ?? "",
    date_joined: toInputDate(employee.date_joined),
    date_of_latest_promotion: toInputDate(employee.date_of_latest_promotion),
    contact_number: employee.contact_number ?? "",
    plantilla_number: employee.plantilla_number ?? "",
    date_of_original_appointment: toInputDate(
      employee.date_of_original_appointment,
    ),
    bp_number: employee.bp_number ? String(employee.bp_number) : "",
    address: employee.address ?? "",
    civil_status: employee.civil_status ?? "",
    date_of_birth: toInputDate(employee.date_of_birth),
    salary_grade: employee.salary_grade ? String(employee.salary_grade) : "",
    salary: employee.salary ?? "",
    employment_status: employee.employment_status ?? "",
    tin: employee.tin ?? "",
    place_of_birth: employee.place_of_birth ?? "",
  };
}

function toEmployeePayload(
  employee: Employee,
  form: EmployeeFormState,
): EmployeeUpdatePayload {
  return {
    employee_number: employee.employee_number,
    first_name: form.first_name.trim(),
    middle_name: form.middle_name.trim(),
    last_name: form.last_name.trim(),
    deped_email: form.deped_email.trim(),
    designation: form.designation.trim(),
    date_joined: toNullableString(form.date_joined),
    date_of_latest_promotion: toNullableString(form.date_of_latest_promotion),
    contact_number: form.contact_number.trim(),
    plantilla_number: form.plantilla_number.trim(),
    date_of_original_appointment: toNullableString(
      form.date_of_original_appointment,
    ),
    bp_number: toNullableNumber(form.bp_number),
    address: form.address.trim(),
    civil_status: form.civil_status.trim(),
    date_of_birth: toNullableString(form.date_of_birth),
    salary_grade: toNullableNumber(form.salary_grade),
    salary: form.salary.trim(),
    employment_status: form.employment_status.trim(),
    tin: form.tin.trim(),
    place_of_birth: form.place_of_birth.trim(),
  };
}

function toCoursePayload(
  employeeNumber: number,
  form: CourseFormState,
): Course {
  return {
    employee_number: employeeNumber,
    course_name: form.course_name.trim(),
    degree_level: form.degree_level,
    units_completed: toNullableNumber(form.units_completed),
    is_finished: form.is_finished ? 1 : 0,
  };
}

function validateEmployeeForm(form: EmployeeFormState): FieldErrorMap {
  const errors = {} as FieldErrorMap;
  if (!form.first_name.trim()) errors.first_name = "First name is required.";
  if (!form.last_name.trim()) errors.last_name = "Last name is required.";
  if (!form.designation.trim()) errors.designation = "Designation is required.";
  if (!form.employment_status.trim())
    errors.employment_status = "Employment status is required.";

  if (
    form.bp_number.trim() !== "" &&
    toNullableNumber(form.bp_number) == null
  ) {
    errors.bp_number = "BP number must be numeric.";
  }
  if (
    form.salary_grade.trim() !== "" &&
    toNullableNumber(form.salary_grade) == null
  ) {
    errors.salary_grade = "Salary grade must be numeric.";
  }

  if (!isValidDateOrEmpty(form.date_joined))
    errors.date_joined = "Invalid date.";
  if (!isValidDateOrEmpty(form.date_of_latest_promotion))
    errors.date_of_latest_promotion = "Invalid date.";
  if (!isValidDateOrEmpty(form.date_of_original_appointment))
    errors.date_of_original_appointment = "Invalid date.";
  if (!isValidDateOrEmpty(form.date_of_birth))
    errors.date_of_birth = "Invalid date.";
  return errors;
}

function validateCourseForm(
  form: CourseFormState,
  courses: Course[],
  editingKey?: string | null,
): FieldErrorMap {
  const errors = {} as FieldErrorMap;
  if (!form.course_name.trim()) errors.course_name = "Course name is required.";
  if (!form.degree_level) errors.degree_level = "Degree level is required.";
  if (
    form.units_completed.trim() !== "" &&
    toNullableNumber(form.units_completed) == null
  ) {
    errors.units_completed = "Units must be numeric.";
  }

  const draftKey = courseKey({
    course_name: form.course_name,
    degree_level: form.degree_level,
  });
  const duplicate = courses.some((course) => {
    const current = courseKey(course);
    if (editingKey && editingKey === current) return false;
    return current === draftKey;
  });
  if (duplicate) errors.course_name = "Duplicate course for this employee.";
  return errors;
}

export {
  toInputDate,
  toNullableString,
  toNullableNumber,
  isValidDateOrEmpty,
  courseKey,
  emptyCourseForm,
  toEmployeeFormState,
  toEmployeePayload,
  toCoursePayload,
  validateEmployeeForm,
  validateCourseForm,
};
