import { AddEmployeeForm } from "@/components/features/dashboard/AddEmployeeForm";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const { addEmployeeActionMock, refreshMock } = vi.hoisted(() => ({
  addEmployeeActionMock: vi.fn(async () => ({
    unwrap: () => ({ employee_number: 99999 }),
  })),
  refreshMock: vi.fn(async () => {}),
}));

vi.mock("@/domain/employees/actions", () => ({
  addEmployeeAction: addEmployeeActionMock,
}));

vi.mock("@/pages/EmployeeDashboard/queries", () => ({
  filterEmployeesQuery: {
    refresh: refreshMock,
  },
}));

describe("AddEmployeeForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("blocks submission when required fields are missing", async () => {
    const user = userEvent.setup();

    render(<AddEmployeeForm closeModal={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Save Employee" }));

    await waitFor(() => {
      expect(addEmployeeActionMock).not.toHaveBeenCalled();
    });
  });

  it("submits final payload and closes modal", async () => {
    const user = userEvent.setup();
    const closeModal = vi.fn();

    const { container } = render(<AddEmployeeForm closeModal={closeModal} />);

    const employeeNumberInput = container.querySelector(
      "input#employee_number",
    ) as HTMLInputElement | null;
    const firstNameInput = container.querySelector(
      "input#first_name",
    ) as HTMLInputElement | null;
    const lastNameInput = container.querySelector(
      "input#last_name",
    ) as HTMLInputElement | null;
    if (!employeeNumberInput || !firstNameInput || !lastNameInput) {
      throw new Error("Employee identity inputs not found");
    }

    await user.type(employeeNumberInput, "945001");
    await user.type(firstNameInput, "E2E");
    await user.type(lastNameInput, "NewEmployee");

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    const designationInput = container.querySelector(
      "input#designation",
    ) as HTMLInputElement | null;
    const employmentStatusInput = container.querySelector(
      "input#employment_status",
    ) as HTMLInputElement | null;
    if (!designationInput || !employmentStatusInput) {
      throw new Error("Employment step inputs not found");
    }
    await user.type(designationInput, "Teacher I");
    await user.type(employmentStatusInput, "Permanent");

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    await user.click(screen.getByRole("button", { name: "Save Employee" }));

    await waitFor(() => {
      expect(addEmployeeActionMock).toHaveBeenCalledTimes(1);
    });

    const payload = addEmployeeActionMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.employee_number).toBe(945001);
    expect(payload.first_name).toBe("E2E");
    expect(payload.last_name).toBe("NewEmployee");
    expect(payload.designation).toBe("Teacher I");
    expect(payload.employment_status).toBe("Permanent");
    expect(refreshMock).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
