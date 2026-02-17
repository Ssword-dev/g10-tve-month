import { createServerAction } from "@/infrastructure/ServerAction";
import {
  type EmployeeUpdatePayload,
  type AddCoursePayload,
  type UpdateCoursePayload,
  type DeleteEmployeeCoursePayload,
  type EmployeeSearchPayload,
  type EmployeeDeletePayload,
  type EmployeeByNumberPayload,
  type CreateEmployeePayload,
  type GetAllEmployeesPayload,
} from "./payloads";
import type { Employee, Course } from "./types";
import { createServerQuery } from "@/infrastructure/ServerQuery";

export const getAllEmployeesAction = createServerAction<
  GetAllEmployeesPayload,
  Employee[]
>({
  name: "getAllEmployees",
  apiUrl: "/api/getAllEmployees",
  method: "GET",
});

export const getAllEmployeesThatSatisfiesAction = createServerAction<
  EmployeeSearchPayload,
  Employee[]
>({
  name: "getAllEmployeesThatSatisfies",
  apiUrl: "/api/getAllEmployeesThatSatisfies",
  method: "GET",
});

export const employeeSearchQuery = createServerQuery(
  "EmployeeDashboard:getAllEmployeesThatSatisfies",
  (name: string) => getAllEmployeesThatSatisfiesAction({ name }),
  [""],
);

export const allEmployeesQuery = createServerQuery(
  "Employees:getAllEmployees",
  () => getAllEmployeesAction({}),
  [],
);

export const getEmployeeByEmployeeNumberAction = createServerAction<
  EmployeeByNumberPayload,
  Employee
>({
  name: "getEmployeeByEmployeeNumber",
  apiUrl: "/api/getEmployeeByEmployeeNumber",
  method: "GET",
});

export const createEmployeeAction = createServerAction<
  CreateEmployeePayload,
  Employee
>({
  name: "createEmployee",
  apiUrl: "/api/createEmployee",
  method: "POST",
});

export const updateEmployeeAction = createServerAction<
  EmployeeUpdatePayload,
  Employee
>({
  name: "updateEmployee",
  apiUrl: "/api/updateEmployee",
  method: "POST",
});

export const deleteEmployeeAction = createServerAction<
  EmployeeDeletePayload,
  void
>({
  name: "deleteEmployee",
  apiUrl: "/api/deleteEmployee",
  method: "POST",
});

export const addCourseToEmployeeAction = createServerAction<
  AddCoursePayload,
  AddCoursePayload
>({
  name: "addCourseToEmployee",
  apiUrl: "/api/addCourseToEmployee",
  method: "POST",
});

export const updateEmployeeCourseAction = createServerAction<
  UpdateCoursePayload,
  Course
>({
  name: "updateEmployeeCourse",
  apiUrl: "/api/updateEmployeeCourse",
  method: "POST",
});

export const deleteEmployeeCourseAction = createServerAction<
  DeleteEmployeeCoursePayload,
  DeleteEmployeeCoursePayload
>({
  name: "deleteEmployeeCourse",
  apiUrl: "/api/deleteEmployeeCourse",
  method: "POST",
});
