import { createServerAction } from "@/infrastructure/ServerAction";
import {
  type UpdateEmployeePayload,
  type AddCoursePayload,
  type UpdateCoursePayload,
  type DeleteCoursePayload,
  type FilterEmployeePayload,
  type DeleteEmployeePayload,
  type GetEmployeePayload,
  type AddEmployeePayload,
  type GetAllEmployeesPayload,
} from "./payloads";
import type { Employee, Course } from "./types";

export const getAllEmployeesAction = createServerAction<
  GetAllEmployeesPayload,
  Employee[]
>({
  name: "getAllEmployees",
  apiUrl: "/api/getAllEmployees",
  method: "GET",
});

export const filterEmployeesAction = createServerAction<
  FilterEmployeePayload,
  Employee[]
>({
  name: "filterEmployees",
  apiUrl: "/api/filterEmployees",
  method: "GET",
});

export const getEmployee = createServerAction<GetEmployeePayload, Employee>({
  name: "getEmployee",
  apiUrl: "/api/getEmployee",
  method: "GET",
});

export const addEmployeeAction = createServerAction<
  AddEmployeePayload,
  Employee
>({
  name: "addEmployee",
  apiUrl: "/api/addEmployee",
  method: "POST",
});

export const updateEmployeeAction = createServerAction<
  UpdateEmployeePayload,
  Employee
>({
  name: "updateEmployee",
  apiUrl: "/api/updateEmployee",
  method: "POST",
});

export const deleteEmployeeAction = createServerAction<
  DeleteEmployeePayload,
  void
>({
  name: "deleteEmployee",
  apiUrl: "/api/deleteEmployee",
  method: "POST",
});

export const addCourseAction = createServerAction<
  AddCoursePayload,
  AddCoursePayload
>({
  name: "addCourse",
  apiUrl: "/api/addCourse",
  method: "POST",
});

export const updateCourseAction = createServerAction<
  UpdateCoursePayload,
  Course
>({
  name: "updateCourse",
  apiUrl: "/api/updateCourse",
  method: "POST",
});

export const deleteCourseAction = createServerAction<
  DeleteCoursePayload,
  DeleteCoursePayload
>({
  name: "deleteCourse",
  apiUrl: "/api/deleteCourse",
  method: "POST",
});
