import { UpdateActionsModal } from "@/components/features/dashboard/UpdateActionsModal";
import type { Employee } from "@/domain/employees/types";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const {
  updateEmployeeActionMock,
  addCourseActionMock,
  updateCourseActionMock,
  deleteCourseActionMock,
} = vi.hoisted(() => ({
  updateEmployeeActionMock: vi.fn(async () => ({ unwrap: () => ({}) })),
  addCourseActionMock: vi.fn(async () => ({ unwrap: () => ({}) })),
  updateCourseActionMock: vi.fn(async () => ({ unwrap: () => ({}) })),
  deleteCourseActionMock: vi.fn(async () => ({ unwrap: () => ({}) })),
}));

vi.mock("@/domain/employees/actions", () => ({
  updateEmployeeAction: updateEmployeeActionMock,
  addCourseAction: addCourseActionMock,
  updateCourseAction: updateCourseActionMock,
  deleteCourseAction: deleteCourseActionMock,
}));

function createEmployee(): Employee {
  return {
    full_name: "E2E User",
    first_name: "E2E",
    middle_name: "",
    last_name: "User",
    deped_email: "e2e.user@deped.gov.ph",
    employee_number: 99101,
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
        employee_number: 99101,
        course_name: "Master of Arts",
        degree_level: "master",
        units_completed: 30,
        is_finished: 1,
      },
    ],
  };
}

describe("UpdateActionsModal", () => {
  afterEach(() => {
    cleanup();
  });

  it("saves employee updates", async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn(async () => {});

    const { container } = render(
      <UpdateActionsModal
        employee={createEmployee()}
        open={true}
        onClose={vi.fn()}
        onSaved={onSaved}
      />,
    );

    const firstNameInput = container.querySelector(
      "input[value='E2E']",
    ) as HTMLInputElement | null;
    if (!firstNameInput) {
      throw new Error("First name input not found");
    }

    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Edited");
    await user.click(screen.getByRole("button", { name: "Save Employee" }));

    await waitFor(() => {
      expect(updateEmployeeActionMock).toHaveBeenCalledTimes(1);
      expect(onSaved).toHaveBeenCalled();
    });
  });

  it("supports course edit mode toggle and cancel", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <UpdateActionsModal
        employee={createEmployee()}
        open={true}
        onClose={vi.fn()}
        onSaved={vi.fn(async () => {})}
      />,
    );

    const editButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.innerHTML.includes("lucide-pencil"),
    ) as HTMLButtonElement | undefined;
    if (!editButton) {
      throw new Error("Course edit button not found");
    }

    await user.click(editButton);
    expect(screen.getByText("Edit Mode")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Edit Mode")).not.toBeInTheDocument();
  });
});
