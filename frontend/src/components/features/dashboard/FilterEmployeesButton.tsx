import { useState } from "react";
import { Filter } from "lucide-react";

import type { Employee, FilterEmployeesPayload } from "@/domain/employees/types";

import { FilterModal } from "./FilterModal";
import { TableToolButton } from "./TableToolButton";

interface FilterEmployeesButtonProps {
  allowedFields?: Array<keyof Employee>;
  activeFilter: FilterEmployeesPayload;
  onFilterApply?: (filter: FilterEmployeesPayload) => void;
}

export function FilterEmployeesButton({
  allowedFields,
  activeFilter,
  onFilterApply,
}: FilterEmployeesButtonProps) {
  const [open, setOpen] = useState(false);

  const handleApplyFilter = (filter: FilterEmployeesPayload) => {
    onFilterApply?.(filter);
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
