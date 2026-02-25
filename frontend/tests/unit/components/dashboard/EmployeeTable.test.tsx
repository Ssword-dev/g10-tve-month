import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeTable } from "@/components/features/dashboard/EmployeeTable";
import type { Employee } from "@/domain/employees/types";

function createEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    full_name: "",
    first_name: "Juan",
    middle_name: "Santos",
    last_name: "Dela Cruz",
    deped_email: "juan.delacruz@deped.gov.ph",
    employee_number: 10001,
    designation: "Teacher I",
    date_joined: "2015-06-01",
    date_of_latest_promotion: "2020-03-15",
    contact_number: "09171234567",
    plantilla_number: "PLANT001",
    date_of_original_appointment: "2015-06-01",
    bp_number: "BP001",
    address: "123 Manila",
    civil_status: "Single",
    date_of_birth: "1985-03-20",
    salary_grade: 11,
    salary: 25000,
    age: null,
    employment_status: "Permanent",
    tin: "123",
    place_of_birth: "Manila",
    courses: [],
    ...overrides,
  };
}

describe("EmployeeTable", () => {
  it("shows fallback full name from parts when full_name is empty", () => {
    render(
      <EmployeeTable
        employees={[
          createEmployee({
            full_name: " ",
            first_name: "Ana",
            middle_name: "",
            last_name: "Reyes",
          }),
        ]}
        isLoading={false}
        error={null}
        showSensitiveFields={true}
        onRetry={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Ana Reyes")).toBeInTheDocument();
  });

  it("hides deped_email when showSensitiveFields is false", () => {
    render(
      <EmployeeTable
        employees={[createEmployee()]}
        isLoading={false}
        error={null}
        showSensitiveFields={false}
        onRetry={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByText("DepEd Email")).not.toBeInTheDocument();
    expect(screen.queryByText("juan.delacruz@deped.gov.ph")).not.toBeInTheDocument();
  });

  it("shows no-results state when employees is empty", () => {
    render(
      <EmployeeTable
        employees={[]}
        isLoading={false}
        error={null}
        showSensitiveFields={true}
        onRetry={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("No employees found.")).toBeInTheDocument();
  });

  it("invokes onSelect when a row with numeric employee_number is clicked", () => {
    const onSelect = vi.fn();
    render(
      <EmployeeTable
        employees={[createEmployee({ employee_number: 20251 })]}
        isLoading={false}
        error={null}
        showSensitiveFields={true}
        onRetry={vi.fn()}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByText("20251"));
    expect(onSelect).toHaveBeenCalledWith(20251);
  });
});
