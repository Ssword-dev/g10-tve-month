import type { Employee } from "@/domain/employees/types";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { employeeFields } from "./filterBuilderShared";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  error: Error | null;
  showSensitiveFields: boolean;
  includeOrder?: Array<keyof Employee> | "ALL";
  onRetry: () => void;
  onSelect: (employeeNumber: number) => void;
}

export function EmployeeTable({
  employees,
  isLoading,
  error,
  showSensitiveFields,
  includeOrder,
  onRetry,
  onSelect,
}: EmployeeTableProps) {
  if (isLoading)
    return (
      <div className="flex h-40 items-center justify-center">
        <Text className="text-muted-foreground">Loading employees...</Text>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-40">
        <Text className="text-destructive">Failed to load employees.</Text>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    );

  const presentFields = new Set<keyof Employee>();
  for (const employee of employees) {
    for (const key of Object.keys(employee) as Array<keyof Employee>) {
      presentFields.add(key);
    }
  }

  const defaultVisibleFields = employeeFields.filter((field) => {
    if (!presentFields.has(field.value)) {
      return false;
    }

    if (field.value === "deped_email" && !showSensitiveFields) {
      return false;
    }

    return true;
  });

  const visibleFields =
    includeOrder && includeOrder !== "ALL"
      ? includeOrder
          .map((field) =>
            employeeFields.find((meta) => meta.value === field),
          )
          .filter((field): field is (typeof employeeFields)[number] => {
            if (!field) {
              return false;
            }

            if (!presentFields.has(field.value)) {
              return false;
            }

            if (field.value === "deped_email" && !showSensitiveFields) {
              return false;
            }

            return true;
          })
      : defaultVisibleFields;

  const visibleColumns = Math.max(visibleFields.length, 1);

  const renderCell = (employee: Employee, field: keyof Employee) => {
    const value = employee[field];

    if (field === "employee_number") {
      if (typeof value === "number") {
        return <span className="text-primary">{value}</span>;
      }

      return <Text className="text-muted-foreground">N/A</Text>;
    }

    if (field === "employment_status") {
      return (
        <Badge className="rounded-full bg-success/20 px-2.5 py-1 text-xs text-success">
          {value == null || value === "" ? "N/A" : String(value)}
        </Badge>
      );
    }

    if (field === "salary" && typeof value === "number") {
      return value.toLocaleString();
    }

    if (field === "courses") {
      return Array.isArray(value) ? value.length : "N/A";
    }

    return value == null || value === "" ? "N/A" : String(value);
  };

  return (
    <div className="h-full min-h-0 min-w-0 overflow-x-scroll overflow-y-scroll">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b text-muted-foreground">
            {visibleFields.map((field) => (
              <th key={field.value} className="py-2 pr-4 font-medium">
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr>
              <td
                colSpan={Math.max(visibleColumns, 1)}
                className="py-6 text-center text-muted-foreground"
              >
                No employees found.
              </td>
            </tr>
          )}
          {employees.map((employee, index) => (
            <tr
              key={employee.employee_number ?? `${index}-${employee.last_name ?? "employee"}`}
              className="border-border/70 cursor-pointer border-b align-top hover:bg-muted/30 last:border-b-0"
              onClick={() => {
                if (typeof employee.employee_number === "number") {
                  onSelect(employee.employee_number);
                }
              }}
            >
              {visibleFields.map((field) => (
                <td key={`${field.value}-${index}`} className="py-3 pr-4">
                  {renderCell(employee, field.value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
