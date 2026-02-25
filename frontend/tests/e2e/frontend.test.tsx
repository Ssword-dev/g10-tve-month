/** @vitest-environment jsdom */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  cleanup();
});

describe("Frontend e2e (jsdom integration)", () => {
  async function renderAt(pathname: string) {
    window.history.replaceState({}, "", pathname);
    const { default: App } = await import("@/App");
    render(<App />);
  }

  it("redirects unknown routes to the landing page", async () => {
    await renderAt("/this-route-does-not-exist");
    expect(await screen.findByText("Get Started")).toBeInTheDocument();
  });

  it("renders login page at /login for unauthenticated users", async () => {
    await renderAt("/login");
    expect(await screen.findByLabelText("DepEd Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("redirects unauthenticated /dashboard/overview to /dashboard/employees", async () => {
    await renderAt("/dashboard/overview");
    expect(
      await screen.findByPlaceholderText(
        "Search full name...",
        {},
        { timeout: 10_000 },
      ),
    ).toBeInTheDocument();
  }, 20_000);

  it("filters employees from frontend controls and handles no-results edge case", async () => {
    const user = userEvent.setup();
    await renderAt("/dashboard/employees");

    const searchInput = await screen.findByPlaceholderText(
      "Search full name...",
      {},
      { timeout: 10_000 },
    );
    await waitFor(() => {
      expect(
        screen.queryByText("Loading employees..."),
      ).not.toBeInTheDocument();
    });

    await user.clear(searchInput);
    await user.type(searchInput, "name-that-does-not-exist-9999");
    const searchButtons = screen.getAllByRole("button", { name: "Search" });
    await user.click(searchButtons[0]);

    expect(await screen.findByText("No employees found.")).toBeInTheDocument();
  }, 20_000);

  it("recovers employee rows after clearing a no-result search", async () => {
    const user = userEvent.setup();
    await renderAt("/dashboard/employees");

    const searchInput = await screen.findByPlaceholderText(
      "Search full name...",
      {},
      { timeout: 10_000 },
    );
    await waitFor(() => {
      expect(
        screen.queryByText("Loading employees..."),
      ).not.toBeInTheDocument();
    });

    await user.clear(searchInput);
    await user.type(searchInput, "name-that-does-not-exist-9999");
    const searchButtons = screen.getAllByRole("button", { name: "Search" });
    await user.click(searchButtons[0]);
    expect(await screen.findByText("No employees found.")).toBeInTheDocument();

    const clearButtons = screen.getAllByRole("button", { name: "Clear" });
    await user.click(clearButtons[0]);

    await waitFor(
      () => {
        const rows = screen.getAllByRole("row");
        expect(rows.length).toBeGreaterThan(1);
        expect(
          screen.queryByText("No employees found."),
        ).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );
  }, 20_000);
});
