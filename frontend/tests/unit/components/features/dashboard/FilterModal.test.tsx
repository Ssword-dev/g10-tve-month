import { FilterModal } from "@/components/features/dashboard/FilterModal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("FilterModal", () => {
  it("builds filter payload with include columns and course filters", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(
      <FilterModal
        open={true}
        onClose={vi.fn()}
        onApply={onApply}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add Column" }));
    await user.click(screen.getByRole("button", { name: "Add Course Filter" }));

    const selects = screen.getAllByRole("combobox");
    const courseModeSelect = selects.find((select) =>
      Array.from(select.querySelectorAll("option")).some((option) => option.textContent === "has specific"),
    );
    expect(courseModeSelect).toBeTruthy();
    if (courseModeSelect) {
      await user.selectOptions(courseModeSelect, "has_specific");
    }

    await user.type(screen.getByPlaceholderText("Course name contains..."), "Education");

    await user.click(screen.getByRole("button", { name: "Apply Filters" }));

    expect(onApply).toHaveBeenCalledTimes(1);
    const payload = onApply.mock.calls[0][0] as Record<string, unknown>;

    expect(payload).toHaveProperty("fields");
    expect(payload).toHaveProperty("where");
    expect(payload).toHaveProperty("sort");
    expect(payload).toHaveProperty("course_filters");

    const courseFilters = payload.course_filters as Array<Record<string, unknown>>;
    expect(courseFilters[0]).toMatchObject({
      mode: "has_specific",
      degree_level: "bachelor",
      course_name: "Education",
    });
  });

  it("resets state back to defaults", async () => {
    const user = userEvent.setup();

    render(
      <FilterModal
        open={true}
        onClose={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add Column" }));
    expect(screen.queryByText("Add a column filter to start building conditions.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText("Add a column filter to start building conditions.")).toBeInTheDocument();
  });
});
