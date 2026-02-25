import { EmployeeInfoModal } from "@/components/features/dashboard/EmployeeInfoModal";
import type { Employee } from "@/domain/employees/types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { employeeIsAdminActionMock, removeAdminRoleActionMock } = vi.hoisted(() => ({
  employeeIsAdminActionMock: vi.fn(async () => ({ unwrap: () => ({ is_admin: true }) })),
  removeAdminRoleActionMock: vi.fn(async () => ({ unwrap: () => ({}) })),
}));

vi.mock("@/domain/auth/actions", () => ({
  employeeIsAdminAction: employeeIsAdminActionMock,
  removeAdminRoleAction: removeAdminRoleActionMock,
}));

function createEmployee(): Employee {
  return {
    full_name: "E2E User",
    first_name: "E2E",
    middle_name: "",
    last_name: "User",
    deped_email: "e2e.user@deped.gov.ph",
    employee_number: 99102,
    designation: "Teacher I",
    date_joined: "2020-01-01",
    date_of_latest_promotion: "",
    contact_number: "",
    plantilla_number: "",
    date_of_original_appointment: "",
    bp_number: "",
    address: "",
    civil_status: "",
    date_of_birth: "",
    salary_grade: 11,
    salary: 25000,
    age: 30,
    employment_status: "Permanent",
    tin: "",
    place_of_birth: "",
    courses: [
      {
        employee_number: 99102,
        course_name: "Master of Arts",
        degree_level: "master",
        units_completed: 30,
        is_finished: 1,
      },
    ],
  };
}

describe("EmployeeInfoModal", () => {
  beforeEach(() => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renders employee details and management actions when permitted", async () => {
    const user = userEvent.setup();
    const onDeleteEmployee = vi.fn(async () => {});

    render(
      <EmployeeInfoModal
        employee={createEmployee()}
        open={true}
        onClose={vi.fn()}
        onOpenAdmin={vi.fn()}
        onDeleteEmployee={onDeleteEmployee}
        canManageEmployees={true}
        showSensitiveFields={true}
      />,
    );

    expect(screen.getByText("Master of Arts")).toBeInTheDocument();
    await waitFor(() => {
      expect(employeeIsAdminActionMock).toHaveBeenCalled();
    });

    expect(await screen.findByRole("button", { name: "Revoke Admin Role" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update Record" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Record" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(onDeleteEmployee).toHaveBeenCalledWith(99102);
    });
  });

  it("hides management actions when user cannot manage employees", () => {
    render(
      <EmployeeInfoModal
        employee={createEmployee()}
        open={true}
        onClose={vi.fn()}
        onOpenAdmin={vi.fn()}
        onDeleteEmployee={vi.fn(async () => {})}
        canManageEmployees={false}
        showSensitiveFields={false}
      />,
    );

    expect(screen.queryByRole("button", { name: "Update Record" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete Record" })).not.toBeInTheDocument();
  });
});
