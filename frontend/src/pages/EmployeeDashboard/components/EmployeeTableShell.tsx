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
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-background pb-16 sm:pb-20">
      {children}
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
