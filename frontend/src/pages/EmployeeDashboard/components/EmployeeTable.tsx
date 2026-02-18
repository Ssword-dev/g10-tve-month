import type { Employee } from "@/domain/employees/types";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Text from "@/components/Text";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onSelect: (employeeNumber: number) => void;
}

export function EmployeeTable({ employees, isLoading, error, onRetry, onSelect }: EmployeeTableProps) {
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

  return (
    <div className="h-full min-h-0 min-w-0 overflow-x-scroll overflow-y-scroll">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Employee #</th>
            <th className="py-2 pr-4 font-medium">Full Name</th>
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Designation</th>
            <th className="py-2 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr>
              <td colSpan={9} className="py-6 text-center text-muted-foreground">
                No employees found.
              </td>
            </tr>
          )}
          {employees.map((employee) => (
            <tr
              key={employee.employee_number}
              className="border-border/70 border-b align-top last:border-b-0"
            >
              <td className="py-3 pr-4">
                <button
                  className="text-primary cursor-help text-left hover:underline"
                  onClick={() => onSelect(employee.employee_number)}
                >
                  {employee.employee_number}
                </button>
              </td>
              <td className="py-3 pr-4">
                <Text weight="medium" className="leading-tight">
                  {employee.last_name}, {employee.first_name} {employee.middle_name}
                </Text>
              </td>
              <td className="py-3 pr-4">{employee.deped_email}</td>
              <td className="py-3 pr-4">{employee.designation}</td>
              <td className="py-3 pr-4">
                <Badge className="rounded-full bg-success/20 px-2.5 py-1 text-xs text-success">
                  {employee.employment_status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
