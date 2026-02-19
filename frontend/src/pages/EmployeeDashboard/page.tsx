import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { currentAdminSessionQuery } from "@/domain/auth/actions";
import { deleteEmployeeAction, getEmployee } from "@/domain/employees/actions";
import type {
  AnyFieldFilter,
  Employee,
  FilterExpression,
  FilterEmployeesPayload,
} from "@/domain/employees/types";
import {
  canManageEmployees,
  getAuthRole,
  getFilterableEmployeeFields,
} from "@/domain/auth/session";
import useServerQuery from "@/hooks/useServerQuery";
import { useState, useEffect, useMemo } from "react";
import {
  EmployeeTableShell,
  EmployeeTable,
  EmployeeInfoModal,
  UpdateActionsModal,
} from "./components";
import { defaultEmployeeFilter, filterEmployeesQuery } from "./queries";

export default function EmployeeDashboard() {
  const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState<
    number | null
  >(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState<FilterEmployeesPayload>(
    defaultEmployeeFilter,
  );
  const [fullNameSearchInput, setFullNameSearchInput] = useState("");
  const [activeModal, setActiveModal] = useState<"none" | "info" | "admin">(
    "none",
  );

  const { data: sessionData } = useServerQuery(currentAdminSessionQuery);
  const { data, isLoading, error } = useServerQuery(filterEmployeesQuery);
  const employees = useMemo(() => data ?? [], [data]);
  const role = getAuthRole(sessionData);
  const canManage = canManageEmployees(sessionData);
  const allowedFilterFields = getFilterableEmployeeFields(role);

  const buildFilterWithFullNameSearch = (
    baseFilter: FilterEmployeesPayload,
    fullNameSearch: string,
  ): FilterEmployeesPayload => {
    const normalizedSearch = fullNameSearch.trim();
    if (normalizedSearch === "") {
      return baseFilter;
    }

    const fullNameFilter: AnyFieldFilter = {
      field: "full_name",
      comparisons: [{ type: "contains", operand: normalizedSearch }],
    };

    const where = baseFilter.where;

    if (!where) {
      return {
        ...baseFilter,
        where: fullNameFilter,
      };
    }

    const isAndGroup =
      typeof (where as FilterExpression & { type?: string }).type ===
        "string" &&
      (where as FilterExpression & { type?: string }).type === "and" &&
      Array.isArray(
        (where as FilterExpression & { filters?: unknown[] }).filters,
      );

    if (isAndGroup) {
      return {
        ...baseFilter,
        where: {
          ...(where as Extract<FilterExpression, { type: "and" }>),
          filters: [
            ...(where as Extract<FilterExpression, { type: "and" }>).filters,
            fullNameFilter,
          ],
        },
      };
    }

    return {
      ...baseFilter,
      where: {
        type: "and",
        filters: [where, fullNameFilter],
      },
    };
  };

  const applyFilter = (
    baseFilter: FilterEmployeesPayload,
    fullNameSearch: string,
  ) => {
    const nextFilter = buildFilterWithFullNameSearch(
      baseFilter,
      fullNameSearch,
    );
    filterEmployeesQuery.refresh(nextFilter);
  };

  useEffect(() => {
    if (selectedEmployeeNumber == null) {
      // this is justified.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <Card className="border-border p-4">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="Search full name..."
            value={fullNameSearchInput}
            onChange={(event) => setFullNameSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyFilter(activeFilter, fullNameSearchInput);
              }
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1.5 text-sm"
              onClick={() => applyFilter(activeFilter, fullNameSearchInput)}
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1.5 text-sm"
              onClick={() => {
                setFullNameSearchInput("");
                applyFilter(activeFilter, "");
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="min-h-0 w-full flex-1 gap-0 overflow-hidden border-border py-0">
        <CardContent className="min-h-0 w-full flex-1 px-5 py-3">
          <EmployeeTableShell
            canManageEmployees={canManage}
            allowedFilterFields={allowedFilterFields}
            activeFilter={activeFilter}
            onFilterApply={(filter) => {
              setActiveFilter(filter);
              applyFilter(filter, fullNameSearchInput);
            }}
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
        onDeleteEmployee={async (employeeNumber) => {
          const result = await deleteEmployeeAction({
            employee_number: employeeNumber,
          });
          result.unwrap();
          await filterEmployeesQuery.refresh();
          setSelectedEmployeeNumber(null);
          setSelectedEmployee(null);
          setActiveModal("none");
        }}
      />

      <UpdateActionsModal
        employee={selectedEmployee}
        open={canManage && activeModal === "admin" && selectedEmployee != null}
        onClose={() => setActiveModal("none")}
        onSaved={() => filterEmployeesQuery.refresh()}
      />
    </main>
  );
}
