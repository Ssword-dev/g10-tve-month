import { filterEmployeesAction } from "@/domain/employees/actions";
import type { FilterEmployeePayload } from "@/domain/employees/payloads";
import { createServerQuery } from "@/infrastructure/ServerQuery";

const filterEmployeesQuery = createServerQuery(
  "EmployeeDashboard:filterEmployeesQuery",
  (opts: FilterEmployeePayload) => filterEmployeesAction(opts),
  [
    {
      fields: {
        include: "ALL",
        exclude: "NONE",
      },
    },
  ],
);

export { filterEmployeesQuery };
