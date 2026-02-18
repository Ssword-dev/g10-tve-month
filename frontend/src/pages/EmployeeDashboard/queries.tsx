import { filterEmployeesAction } from "@/domain/employees/actions";
import type { FilterEmployeePayload } from "@/domain/employees/payloads";
import type { FilterEmployeesPayload } from "@/domain/employees/types";
import { createServerQuery } from "@/infrastructure/ServerQuery";

const defaultEmployeeFilter: FilterEmployeesPayload = {
  fields: {
    include: [
      "employee_number",
      "first_name",
      "middle_name",
      "last_name",
      "deped_email",
      "designation",
      "employment_status",
    ],
    exclude: "NONE",
  },
  sort: [
    { basis: "last_name", direction: "asc" },
    { basis: "first_name", direction: "asc" },
  ],
};

const filterEmployeesQuery = createServerQuery(
  "EmployeeDashboard:filterEmployeesQuery",
  (opts: FilterEmployeePayload) => filterEmployeesAction(opts),
  [defaultEmployeeFilter],
);

export { filterEmployeesQuery, defaultEmployeeFilter };
