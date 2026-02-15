import { createServerAction } from "@/infrastructure/ServerAction";
import type {
  EmployeeUpdatePayload,
  AddCoursePayload,
  UpdateCoursePayload,
  DeleteEmployeeCoursePayload,
  EmployeeSearchPayload,
} from "./payloads";
import type { Employee, Course } from "./types";
import { createServerQuery } from "@/infrastructure/ServerQuery";

export const getAllEmployeesThatSatisfiesAction = createServerAction<
  EmployeeSearchPayload,
  Employee[]
>({
  name: "getAllEmployeesThatSatisfies",
  apiUrl: "/api/getAllEmployeesThatSatisfies",
});

export const employeeSearchQuery = createServerQuery(
  "EmployeeDashboard:getAllEmployeesThatSatisfies",
  (name: string) => getAllEmployeesThatSatisfiesAction({ name }),
  [""],
);

export const updateEmployeeAction = createServerAction<
  EmployeeUpdatePayload,
  Employee
>({
  name: "updateEmployee",
  apiUrl: "/api/updateEmployee",
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
