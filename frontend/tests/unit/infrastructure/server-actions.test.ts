import { createServerAction, unwrap } from "@/infrastructure/ServerAction";
import unsafeCast from "@/utils/unsafeCast";
import { afterEach, describe, expect, it, vi } from "vitest";

let actionNameCounter = 0;

function nextActionName() {
  actionNameCounter += 1;
  return `unit:testAction:${actionNameCounter}`;
}

describe("ServerAction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends GET params as query string and no request body", async () => {
    const fetchMock = vi.fn(async () => ({
      json: async () => ({ type: "data", data: { ok: true } }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const action = createServerAction<
      { employee_number: number; name: string },
      { ok: boolean }
    >({
      name: nextActionName(),
      apiUrl: "/api/getEmployee",
      method: "GET",
    });

    const result = await action({ employee_number: 123, name: "Juan" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = unsafeCast<[string, RequestInit]>(
      fetchMock.mock.calls[0],
    );
    expect(url).toContain("/api/getEmployee?");
    expect(url).toContain("employee_number=123");
    expect(url).toContain("name=Juan");
    expect(init.method).toBe("GET");
    expect(init.body).toBeNull();
    expect(result.type).toBe("data");
  });

  it("sends POST params as JSON body", async () => {
    const fetchMock = vi.fn(async () => ({
      json: async () => ({ type: "data", data: { id: 1 } }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const action = createServerAction<
      { first_name: string; last_name: string },
      { id: number }
    >({
      name: nextActionName(),
      apiUrl: "/api/addEmployee",
      method: "POST",
    });

    await action({ first_name: "E2E", last_name: "Employee" });

    const [, init] = unsafeCast<[string, RequestInit]>(fetchMock.mock.calls[0]);
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(init.body).toBe(
      JSON.stringify({ first_name: "E2E", last_name: "Employee" }),
    );
  });

  it("sends FormData body without forcing JSON content type", async () => {
    const fetchMock = vi.fn(async () => ({
      json: async () => ({ type: "success", message: "ok" }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const action = createServerAction<FormData, void>({
      name: nextActionName(),
      apiUrl: "/api/upload",
      method: "POST",
    });

    const formData = new FormData();
    formData.append(
      "avatar",
      new Blob(["avatar"], { type: "image/png" }),
      "avatar.png",
    );

    await action(formData);

    const [, init] = unsafeCast<[string, RequestInit]>(fetchMock.mock.calls[0]);
    expect(init.body).toBe(formData);
    const headers = (init.headers ?? {}) as Record<string, string>;
    expect(headers["Content-Type"]).toBeUndefined();
  });

  it("unwrap handles data, success and error response variants", () => {
    expect(
      unwrap({
        type: "data",
        data: { foo: "bar" },
        unwrap: () => ({ foo: "bar" }),
      }),
    ).toEqual({ foo: "bar" });
    expect(unwrap({ type: "success", data: 42, unwrap: () => 42 })).toBe(42);
    expect(() =>
      unwrap({
        type: "error",
        message: "boom",
        unwrap: () => {
          throw new Error("boom");
        },
      }),
    ).toThrow("boom");
  });

  it("returns normalized error response when fetch/json parsing fails", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("network failure");
    });
    vi.stubGlobal("fetch", fetchMock);

    const action = createServerAction<Record<string, never>, { foo: string }>({
      name: nextActionName(),
      apiUrl: "/api/test",
      method: "POST",
    });

    const result = await action({});

    expect(result.type).toBe("error");
    if (result.type === "error") {
      expect(result.message).toBe("Invalid JSON response");
    }
    expect(() => result.unwrap()).toThrow("Invalid JSON response");
  });

  it("caches actions by name", () => {
    const actionName = nextActionName();
    const first = createServerAction<Record<string, never>, { ok: true }>({
      name: actionName,
      apiUrl: "/api/test",
      method: "GET",
    });

    const second = createServerAction<Record<string, never>, { ok: true }>({
      name: actionName,
      apiUrl: "/api/another-url",
      method: "POST",
    });

    expect(second).toBe(first);
    expect(second.apiUrl).toBe("/api/test");
    expect(second.method).toBe("GET");
  });
});
