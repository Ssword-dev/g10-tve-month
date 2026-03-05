import type { Employee } from "@/domain/employees/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
import { employeeFields } from "./filterBuilderShared";

const tableFields = [
  ...employeeFields,
  {
    value: "courses" as keyof Employee,
    label: "Courses",
  },
];

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
      <div className="flex h-full min-h-0 items-center justify-center rounded-md border border-border/70">
        <Text className="text-muted-foreground">Loading employees...</Text>
      </div>
    );

  if (error)
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center gap-3 rounded-md border border-border/70">
        <Text className="text-destructive">Failed to load employees.</Text>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    );

  const getComputedValue = (employee: Employee, field: keyof Employee) => {
    if (field === "full_name") {
      if (
        typeof employee.full_name === "string" &&
        employee.full_name.trim() !== ""
      ) {
        return employee.full_name;
      }

      const fallbackName = [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
      ]
        .filter((part) => typeof part === "string" && part.trim() !== "")
        .join(" ")
        .trim();

      return fallbackName === "" ? null : fallbackName;
    }

    if (field === "age") {
      if (typeof employee.age === "number") {
        return employee.age;
      }

      if (
        typeof employee.date_of_birth === "string" &&
        employee.date_of_birth !== ""
      ) {
        const birthDate = new Date(employee.date_of_birth);
        if (!Number.isNaN(birthDate.getTime())) {
          const now = new Date();
          let years = now.getFullYear() - birthDate.getFullYear();
          const beforeBirthday =
            now.getMonth() < birthDate.getMonth() ||
            (now.getMonth() === birthDate.getMonth() &&
              now.getDate() < birthDate.getDate());
          if (beforeBirthday) {
            years -= 1;
          }

          return years >= 0 ? years : null;
        }
      }

      return null;
    }

    if (field === "courses") {
      return Array.isArray(employee.courses) ? employee.courses.length : null;
    }

    return employee[field];
  };

  const isVisibleField = (employee: Employee, field: keyof Employee) => {
    const computedValue = getComputedValue(employee, field);
    return computedValue != null && computedValue !== "";
  };

  const presentFields = new Set<keyof Employee>();
  for (const employee of employees) {
    for (const field of tableFields) {
      if (isVisibleField(employee, field.value)) {
        presentFields.add(field.value);
      }
    }
  }

  const defaultVisibleFields = tableFields.filter((field) => {
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
          .map((field) => tableFields.find((meta) => meta.value === field))
          .filter((field): field is (typeof tableFields)[number] => {
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
    const value = getComputedValue(employee, field);

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
      return typeof value === "number" ? value : "N/A";
    }

    return value == null || value === "" ? "N/A" : String(value);
  };

  return (
    <div className="px-2 py-1 h-full min-h-0 min-w-0 overflow-auto rounded-md border border-border/70">
      <table className="w-full min-w-[780px] text-left text-sm">
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
              key={
                employee.employee_number ??
                `${index}-${employee.last_name ?? "employee"}`
              }
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
