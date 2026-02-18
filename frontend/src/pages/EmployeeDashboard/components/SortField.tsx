import { X } from "lucide-react";

import type { Employee } from "@/domain/employees/types";
import Button from "@/components/Button";

import { employeeFields } from "./filterBuilderShared";

interface SortFieldProps {
  allowedFields?: Array<keyof Employee>;
  basis: keyof Employee;
  direction: "asc" | "desc";
  onChange: (basis: keyof Employee, direction: "asc" | "desc") => void;
  onRemove: () => void;
}

export function SortField({
  allowedFields,
  basis,
  direction,
  onChange,
  onRemove,
}: SortFieldProps) {
  const selectableFields =
    allowedFields && allowedFields.length > 0
      ? employeeFields.filter((field) => allowedFields.includes(field.value))
      : employeeFields;

  return (
    <div className="flex items-center gap-2 p-2 bg-card border-border rounded-lg border">
      <select
        value={basis}
        onChange={(e) => onChange(e.target.value as keyof Employee, direction)}
        className="bg-transparent border-none text-sm focus:outline-none"
      >
        {selectableFields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <select
        value={direction}
        onChange={(e) => onChange(basis, e.target.value as "asc" | "desc")}
        className="bg-transparent border-none text-sm focus:outline-none"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
