import type { Employee } from "@/domain/employees/types";

import { employeeFields } from "./filterBuilderShared";

interface FieldSelectorProps {
  value: keyof Employee;
  onChange: (value: keyof Employee) => void;
}

export function FieldSelector({ value, onChange }: FieldSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as keyof Employee)}
      className="bg-card border-border rounded-lg border px-3 py-1.5 text-sm"
    >
      {employeeFields.map((field) => (
        <option key={field.value} value={field.value}>
          {field.label}
        </option>
      ))}
    </select>
  );
}
