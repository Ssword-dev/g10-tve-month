import type { PropsWithChildren } from "react";

import { AddEmployeeButton } from "./AddEmployeeButton";
import { FilterEmployeesButton } from "./FilterEmployeesButton";
import { TableTools } from "./TableTools";

export function EmployeeTableShell({ children }: PropsWithChildren) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-auto bg-background">
      {children}
      <TableTools>
        <AddEmployeeButton />
        <FilterEmployeesButton />
      </TableTools>
    </div>
  );
}
