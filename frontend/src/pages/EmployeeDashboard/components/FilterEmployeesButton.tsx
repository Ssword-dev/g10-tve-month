import { useState } from "react";
import { Filter } from "lucide-react";

import type { Employee, FilterEmployeesPayload } from "@/domain/employees/types";

import { defaultEmployeeFilter, filterEmployeesQuery } from "../queries";
import { FilterModal } from "./FilterModal";
import { TableToolButton } from "./TableToolButton";

interface FilterEmployeesButtonProps {
  allowedFields?: Array<keyof Employee>;
}

export function FilterEmployeesButton({ allowedFields }: FilterEmployeesButtonProps) {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterEmployeesPayload>(defaultEmployeeFilter);

  const handleApplyFilter = (filter: FilterEmployeesPayload) => {
    setActiveFilter(filter);
    filterEmployeesQuery.refresh(filter);
    setOpen(false);
  };

  return (
    <>
      <TableToolButton onClick={() => setOpen(true)}>
        <Filter className="h-5 w-5" />
      </TableToolButton>

      <FilterModal
        open={open}
        onClose={() => setOpen(false)}
        onApply={handleApplyFilter}
        initialFilter={activeFilter}
        allowedFields={allowedFields}
      />
    </>
  );
}
