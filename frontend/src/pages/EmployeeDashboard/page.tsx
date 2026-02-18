import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import useServerQuery from "@/hooks/useServerQuery";
import { useState, useMemo, useEffect } from "react";
import {
  EmployeeTableShell,
  EmployeeTable,
  EmployeeInfoModal,
  AdminActionsModal,
} from "./components";
import { filterEmployeesQuery } from "./queries";

export default function EmployeeDashboard() {
  const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState<
    number | null
  >(null);
  const [activeModal, setActiveModal] = useState<"none" | "info" | "admin">(
    "none",
  );

  const { data, isLoading, error } = useServerQuery(filterEmployeesQuery);
  const employees = data ?? [];

  const selectedEmployee = useMemo(
    () =>
      selectedEmployeeNumber == null
        ? null
        : (employees.find(
            (employee) => employee.employee_number === selectedEmployeeNumber,
          ) ?? null),
    [employees, selectedEmployeeNumber],
  );

  useEffect(() => {
    if (selectedEmployeeNumber != null && !selectedEmployee) {
      // This is guarded.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedEmployeeNumber(null);
      setActiveModal("none");
    }
  }, [selectedEmployee, selectedEmployeeNumber]);

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col gap-6 overflow-hidden p-4 md:p-8">
      <Card className="min-h-0 w-full flex-1 gap-0 overflow-hidden border-border py-0">
        <CardContent className="min-h-0 w-full flex-1 px-5 py-3">
          <EmployeeTableShell>
            <EmployeeTable
              employees={employees}
              isLoading={isLoading}
              error={error}
              onRetry={() => {
                filterEmployeesQuery.refresh();
              }}
              onSelect={(employeeNumber) => {
                setSelectedEmployeeNumber(employeeNumber);
                setActiveModal("info");
              }}
            />
          </EmployeeTableShell>
        </CardContent>
      </Card>

      <EmployeeInfoModal
        employee={selectedEmployee}
        open={activeModal === "info" && selectedEmployee != null}
        onClose={() => {
          setSelectedEmployeeNumber(null);
          setActiveModal("none");
        }}
        onOpenAdmin={() => setActiveModal("admin")}
      />

      <AdminActionsModal
        employee={selectedEmployee}
        open={activeModal === "admin" && selectedEmployee != null}
        onClose={() => setActiveModal("none")}
        onSaved={() => filterEmployeesQuery.refresh()}
      />
    </main>
  );
}
