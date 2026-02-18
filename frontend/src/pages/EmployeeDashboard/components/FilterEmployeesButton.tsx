import { useState } from "react";
import { Filter } from "lucide-react";

import type { FilterEmployeesPayload } from "@/domain/employees/types";

import { filterEmployeesQuery } from "../queries";
import { FilterModal } from "./FilterModal";
import { TableToolButton } from "./TableToolButton";

export function FilterEmployeesButton() {
  const [open, setOpen] = useState(false);

  const handleApplyFilter = (filter: FilterEmployeesPayload) => {
    filterEmployeesQuery.refresh(filter);
    setOpen(false);
  };

  return (
    <>
      <TableToolButton onClick={() => setOpen(true)}>
        <Filter className="h-5 w-5" />
      </TableToolButton>

      <FilterModal open={open} onClose={() => setOpen(false)} onApply={handleApplyFilter} />
    </>
  );
}
