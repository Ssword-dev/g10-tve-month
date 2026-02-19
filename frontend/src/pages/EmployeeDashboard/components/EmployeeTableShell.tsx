import type { PropsWithChildren } from "react";
import type { Employee, FilterEmployeesPayload } from "@/domain/employees/types";

import { AddEmployeeButton } from "./AddEmployeeButton";
import { FilterEmployeesButton } from "./FilterEmployeesButton";
import { TableTools } from "./TableTools";

interface EmployeeTableShellProps extends PropsWithChildren {
  canManageEmployees: boolean;
  allowedFilterFields: Array<keyof Employee>;
  onFilterApply?: (filter: FilterEmployeesPayload) => void;
}

export function EmployeeTableShell({
  children,
  canManageEmployees,
  allowedFilterFields,
  onFilterApply,
}: EmployeeTableShellProps) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-auto bg-background">
      {children}
      <TableTools>
        {canManageEmployees ? <AddEmployeeButton /> : null}
        <FilterEmployeesButton
          allowedFields={allowedFilterFields}
          onFilterApply={onFilterApply}
        />
      </TableTools>
    </div>
  );
}
