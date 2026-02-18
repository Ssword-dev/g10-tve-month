import type { Employee } from "@/domain/employees/types";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Text from "@/components/Text";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  error: Error | null;
  showSensitiveFields: boolean;
  onRetry: () => void;
  onSelect: (employeeNumber: number) => void;
}

export function EmployeeTable({
  employees,
  isLoading,
  error,
  showSensitiveFields,
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

  const hasEmployeeNumber = employees.some((employee) => employee.employee_number != null);
  const hasName =
    employees.some((employee) => employee.last_name != null) ||
    employees.some((employee) => employee.first_name != null) ||
    employees.some((employee) => employee.middle_name != null);
  const hasEmail = showSensitiveFields && employees.some((employee) => employee.deped_email != null);
  const hasDesignation = employees.some((employee) => employee.designation != null);
  const hasStatus = employees.some((employee) => employee.employment_status != null);

  const visibleColumns = [
    hasEmployeeNumber,
    hasName,
    hasEmail,
    hasDesignation,
    hasStatus,
  ].filter(Boolean).length;

  return (
    <div className="h-full min-h-0 min-w-0 overflow-x-scroll overflow-y-scroll">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b text-muted-foreground">
            {hasEmployeeNumber ? <th className="py-2 pr-4 font-medium">Employee #</th> : null}
            {hasName ? <th className="py-2 pr-4 font-medium">Full Name</th> : null}
            {hasEmail ? <th className="py-2 pr-4 font-medium">Email</th> : null}
            {hasDesignation ? <th className="py-2 pr-4 font-medium">Designation</th> : null}
            {hasStatus ? <th className="py-2 pr-4 font-medium">Status</th> : null}
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
              className="border-border/70 border-b align-top last:border-b-0"
            >
              {hasEmployeeNumber ? (
                <td className="py-3 pr-4">
                  {employee.employee_number != null ? (
                    <button
                      className="text-primary cursor-help text-left hover:underline"
                      onClick={() => onSelect(employee.employee_number)}
                    >
                      {employee.employee_number}
                    </button>
                  ) : (
                    <Text className="text-muted-foreground">N/A</Text>
                  )}
                </td>
              ) : null}
              {hasName ? (
                <td className="py-3 pr-4">
                  <Text weight="medium" className="leading-tight">
                    {employee.last_name ?? "N/A"}, {employee.first_name ?? "N/A"}{" "}
                    {employee.middle_name ?? ""}
                  </Text>
                </td>
              ) : null}
              {hasEmail ? (
                <td className="py-3 pr-4">{employee.deped_email ?? "N/A"}</td>
              ) : null}
              {hasDesignation ? (
                <td className="py-3 pr-4">{employee.designation ?? "N/A"}</td>
              ) : null}
              {hasStatus ? (
                <td className="py-3 pr-4">
                  <Badge className="rounded-full bg-success/20 px-2.5 py-1 text-xs text-success">
                    {employee.employment_status ?? "N/A"}
                  </Badge>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
