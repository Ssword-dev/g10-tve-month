import type {
  DegreeLevel,
  Employee,
  Course,
  FilterEmployeesPayload as FilterEmployeesPayloadInterface,
} from "./types";

// Course-related payloads
type UpdateCoursePayload = Course & {
  original_course_name: string;
  original_degree_level: DegreeLevel;
};

type AddCoursePayload = Course;

type DeleteCoursePayload = {
  employee_number: number;
  course_name: string;
  degree_level: DegreeLevel;
};

// Employee-related payloads
type AddEmployeePayload = Employee;

type UpdateEmployeePayload = {
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

type DeleteEmployeePayload = {
  employee_number: number;
};

type GetEmployeePayload = {
  employee_number: number;
};

type FilterEmployeePayload = {
  [K in keyof FilterEmployeesPayloadInterface]: FilterEmployeesPayloadInterface[K];
};

type GetAllEmployeesPayload = Record<string, never>;

export type {
  // Course
  UpdateCoursePayload,
  AddCoursePayload,
  DeleteCoursePayload,

  // Employee
  AddEmployeePayload,
  UpdateEmployeePayload,
  DeleteEmployeePayload,
  GetEmployeePayload,
  FilterEmployeePayload,
  GetAllEmployeesPayload,
};
