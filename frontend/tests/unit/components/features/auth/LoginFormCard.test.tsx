import { LoginFormCard } from "@/components/features/auth/LoginFormCard";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

describe("LoginFormCard", () => {
  it("renders required fields and error text", () => {
    render(
      <MemoryRouter>
        <LoginFormCard
          depedEmail=""
          password=""
          errorText="Invalid credentials"
          isSubmitting={false}
          onDepedEmailChange={vi.fn()}
          onPasswordChange={vi.fn()}
          onSubmit={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("DepEd Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("calls change handlers and submit", async () => {
    const user = userEvent.setup();
    const onDepedEmailChange = vi.fn();
    const onPasswordChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <MemoryRouter>
        <LoginFormCard
          depedEmail=""
          password=""
          errorText=""
          isSubmitting={false}
          onDepedEmailChange={onDepedEmailChange}
          onPasswordChange={onPasswordChange}
          onSubmit={onSubmit}
        />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("DepEd Email"), "admin@deped.gov.ph");
    await user.type(screen.getByLabelText("Password"), "P@ssword1234");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(onDepedEmailChange).toHaveBeenCalled();
    expect(onPasswordChange).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables submit while submitting", () => {
    render(
      <MemoryRouter>
        <LoginFormCard
          depedEmail=""
          password=""
          errorText=""
          isSubmitting={true}
          onDepedEmailChange={vi.fn()}
          onPasswordChange={vi.fn()}
          onSubmit={vi.fn()}
        />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole("button", { name: "Signing in..." });
    expect(submitButton).toBeDisabled();
  });
});
