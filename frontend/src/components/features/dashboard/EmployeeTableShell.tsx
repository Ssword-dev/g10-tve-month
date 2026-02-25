import type { PropsWithChildren } from "react";
import type { Employee, FilterEmployeesPayload } from "@/domain/employees/types";

import { AddEmployeeButton } from "./AddEmployeeButton";
import { FilterEmployeesButton } from "./FilterEmployeesButton";
import { TableTools } from "./TableTools";

interface EmployeeTableShellProps extends PropsWithChildren {
  canManageEmployees: boolean;
  allowedFilterFields: Array<keyof Employee>;
  activeFilter: FilterEmployeesPayload;
  onFilterApply?: (filter: FilterEmployeesPayload) => void;
}

export function EmployeeTableShell({
  children,
  canManageEmployees,
  allowedFilterFields,
  activeFilter,
  onFilterApply,
}: EmployeeTableShellProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-background">
      <div className="min-h-0 flex-1">{children}</div>
      <TableTools>
        {canManageEmployees ? <AddEmployeeButton /> : null}
        <FilterEmployeesButton
          allowedFields={allowedFilterFields}
          activeFilter={activeFilter}
          onFilterApply={onFilterApply}
        />
      </TableTools>
    </div>
  );
}
