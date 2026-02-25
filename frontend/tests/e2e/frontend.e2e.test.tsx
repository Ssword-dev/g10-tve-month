import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const baseUrl = process.env.VITEST_E2E_BASE_URL ?? "http://127.0.0.1:8000";

const originalFetch = globalThis.fetch;

beforeAll(() => {
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api/")) {
      const apiPath = input.slice("/api/".length);
      return originalFetch(`${baseUrl}/${apiPath}`, init);
    }

    if (input instanceof URL && input.pathname.startsWith("/api/")) {
      const apiPath = input.pathname.slice("/api/".length);
      return originalFetch(`${baseUrl}/${apiPath}${input.search}`, init);
    }

    return originalFetch(input, init);
  };
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});

beforeEach(() => {
  vi.resetModules();
  window.history.replaceState({}, "", "/dashboard/employees");
});

afterEach(() => {
  cleanup();
});

describe("Frontend e2e", () => {
  async function renderApp() {
    const { default: App } = await import("@/App");
    render(<App />);
  }

  it("renders employee dashboard table from live backend data", async () => {
    await renderApp();

    expect(
      await screen.findByPlaceholderText("Search full name...", {}, { timeout: 10_000 }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading employees...")).not.toBeInTheDocument();
    }, { timeout: 10_000 });

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Employee Number")).toBeInTheDocument();

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1);
    }, { timeout: 10_000 });
  }, 20_000);

  it("filters employees from frontend controls and handles no-results edge case", async () => {
    const user = userEvent.setup();
    await renderApp();

    const searchInput = await screen.findByPlaceholderText(
      "Search full name...",
      {},
      { timeout: 10_000 },
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading employees...")).not.toBeInTheDocument();
    });

    await user.clear(searchInput);
    await user.type(searchInput, "name-that-does-not-exist-9999");
    const searchButtons = screen.getAllByRole("button", { name: "Search" });
    await user.click(searchButtons[0]);

    expect(await screen.findByText("No employees found.")).toBeInTheDocument();
  }, 20_000);
});
