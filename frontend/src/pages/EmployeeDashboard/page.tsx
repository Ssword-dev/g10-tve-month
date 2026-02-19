import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import { currentAdminSessionQuery } from "@/domain/auth/actions";
import { getEmployee } from "@/domain/employees/actions";
import type { Employee, FilterEmployeesPayload } from "@/domain/employees/types";
import {
  canManageEmployees,
  getAuthRole,
  getFilterableEmployeeFields,
} from "@/domain/auth/session";
import useServerQuery from "@/hooks/useServerQuery";
import { useState, useEffect } from "react";
import {
  EmployeeTableShell,
  EmployeeTable,
  EmployeeInfoModal,
  AdminActionsModal,
} from "./components";
import { defaultEmployeeFilter, filterEmployeesQuery } from "./queries";

export default function EmployeeDashboard() {
  const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState<
    number | null
  >(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeFilter, setActiveFilter] =
    useState<FilterEmployeesPayload>(defaultEmployeeFilter);
  const [activeModal, setActiveModal] = useState<"none" | "info" | "admin">(
    "none",
  );

  const { data: sessionData } = useServerQuery(currentAdminSessionQuery);
  const { data, isLoading, error } = useServerQuery(filterEmployeesQuery);
  const employees = data ?? [];
  const role = getAuthRole(sessionData);
  const canManage = canManageEmployees(sessionData);
  const allowedFilterFields = getFilterableEmployeeFields(role);

  useEffect(() => {
    if (selectedEmployeeNumber == null) {
      setSelectedEmployee(null);
      return;
    }

    const initial =
      employees.find(
        (employee) => employee.employee_number === selectedEmployeeNumber,
      ) ?? null;

    if (initial) {
      setSelectedEmployee((current) =>
        current?.employee_number === selectedEmployeeNumber ? current : initial,
      );
    }

    let cancelled = false;

    const loadDetails = async () => {
      try {
        const result = await getEmployee({
          employee_number: selectedEmployeeNumber,
        });
        const fullEmployee = result.unwrap();

        if (!cancelled) {
          setSelectedEmployee(fullEmployee);
        }
      } catch {
        if (!cancelled) {
          // Keep the best available local snapshot.
          setSelectedEmployee((current) => current ?? initial);
        }
      }
    };

    void loadDetails();

    return () => {
      cancelled = true;
    };
  }, [employees, selectedEmployeeNumber]);

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col gap-6 overflow-hidden p-4 md:p-8">
      <Card className="min-h-0 w-full flex-1 gap-0 overflow-hidden border-border py-0">
        <CardContent className="min-h-0 w-full flex-1 px-5 py-3">
          <EmployeeTableShell
            canManageEmployees={canManage}
            allowedFilterFields={allowedFilterFields}
            onFilterApply={setActiveFilter}
          >
            <EmployeeTable
              employees={employees}
              isLoading={isLoading}
              error={error}
              showSensitiveFields={canManage}
              includeOrder={activeFilter.fields.include}
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
        canManageEmployees={canManage}
        showSensitiveFields={canManage}
        onOpenAdmin={() => {
          if (!canManage) {
            return;
          }

          setActiveModal("admin");
        }}
      />

      <AdminActionsModal
        employee={selectedEmployee}
        open={canManage && activeModal === "admin" && selectedEmployee != null}
        onClose={() => setActiveModal("none")}
        onSaved={() => filterEmployeesQuery.refresh()}
      />
    </main>
  );
}
