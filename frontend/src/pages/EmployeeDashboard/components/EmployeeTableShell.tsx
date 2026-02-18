import type { PropsWithChildren } from "react";
import type { Employee } from "@/domain/employees/types";

import { AddEmployeeButton } from "./AddEmployeeButton";
import { FilterEmployeesButton } from "./FilterEmployeesButton";
import { TableTools } from "./TableTools";

interface EmployeeTableShellProps extends PropsWithChildren {
  canManageEmployees: boolean;
  allowedFilterFields: Array<keyof Employee>;
}

export function EmployeeTableShell({
  children,
  canManageEmployees,
  allowedFilterFields,
}: EmployeeTableShellProps) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-auto bg-background">
      {children}
      <TableTools>
        {canManageEmployees ? <AddEmployeeButton /> : null}
        <FilterEmployeesButton allowedFields={allowedFilterFields} />
      </TableTools>
    </div>
  );
}
