import type { DegreeLevel } from "./types";
import type { Course } from "./types";

type UpdateCoursePayload = Course & {
  original_course_name: string;
  original_degree_level: DegreeLevel;
};

type EmployeeUpdatePayload = {
  employee_number: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  deped_email: string;
  designation: string;
  date_joined: string | null;
  date_of_latest_promotion: string | null;
  contact_number: string;
  plantilla_number: string;
  date_of_original_appointment: string | null;
  bp_number: number | null;
  address: string;
  civil_status: string;
  date_of_birth: string | null;
  salary_grade: number | null;
  salary: string;
  employment_status: string;
  tin: string;
  place_of_birth: string;
};

// input for adding a course to an employee
type AddCoursePayload = Course;

// input for deleting an employee's course
type DeleteEmployeeCoursePayload = {
  employee_number: number;
  course_name: string;
  degree_level: DegreeLevel;
};

// input for searching employees
type EmployeeSearchPayload = {
  name: string;
};

export type {
  UpdateCoursePayload,
  EmployeeUpdatePayload,
  AddCoursePayload,
  DeleteEmployeeCoursePayload,
  EmployeeSearchPayload,
};
