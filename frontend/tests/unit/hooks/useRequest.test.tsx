import useRequest from "@/hooks/useRequest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles idle -> loading -> success transition", async () => {
    let resolveFetch: ((value: unknown) => void) | null = null;
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRequest<{ id: number }>());

    expect(result.current.isIdle).toBe(true);

    let pending: Promise<{ id: number } | null>;
    await act(async () => {
      pending = result.current.execute({ url: "/api/test", method: "GET" });
    });

    expect(result.current.isLoading).toBe(true);

    resolveFetch?.({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      json: async () => ({ id: 1 }),
      text: async () => "",
    });

    await act(async () => {
      await pending!;
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual({ id: 1 });
  });

  it("supports json, text and none parser modes", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        json: async () => ({ foo: "bar" }),
        text: async () => "ignored",
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        json: async () => ({ ignored: true }),
        text: async () => "plain-text",
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        statusText: "No Content",
        headers: new Headers(),
        json: async () => ({ ignored: true }),
        text: async () => "ignored",
      });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRequest());

    await act(async () => {
      const jsonPayload = await result.current.execute({ url: "/api/json", parser: "json" });
      expect(jsonPayload).toEqual({ foo: "bar" });

      const textPayload = await result.current.execute({ url: "/api/text", parser: "text" });
      expect(textPayload).toBe("plain-text");

      const nonePayload = await result.current.execute({ url: "/api/none", parser: "none" });
      expect(nonePayload).toBeNull();
    });
  });

  it("applies JSON content type only for object bodies", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        json: async () => ({ ok: true }),
        text: async () => "",
      });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRequest());

    await act(async () => {
      await result.current.execute({
        url: "/api/object",
        method: "POST",
        body: { name: "Ana" },
      });

      const formData = new FormData();
      formData.append("file", new Blob(["x"]), "a.txt");
      await result.current.execute({
        url: "/api/form",
        method: "POST",
        body: formData,
      });

      await result.current.execute({
        url: "/api/text",
        method: "POST",
        body: "raw",
      });
    });

    const objectInit = fetchMock.mock.calls[0][1] as RequestInit;
    const formInit = fetchMock.mock.calls[1][1] as RequestInit;
    const textInit = fetchMock.mock.calls[2][1] as RequestInit;

    expect(objectInit.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(objectInit.body).toBe(JSON.stringify({ name: "Ana" }));

    expect((formInit.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
    expect(formInit.body).toBeInstanceOf(FormData);

    expect((textInit.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
    expect(textInit.body).toBe("raw");
  });

  it("supports abort and reset", async () => {
    let capturedSignal: AbortSignal | null = null;

    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      capturedSignal = init?.signal ?? null;
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        json: async () => ({ ok: true }),
        text: async () => "",
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRequest());

    await act(async () => {
      await result.current.execute({ url: "/api/test" });
    });

    act(() => {
      result.current.abort();
    });

    expect(capturedSignal?.aborted).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("transitions to error state when response is not ok", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: new Headers(),
      json: async () => ({ message: "nope" }),
      text: async () => "nope",
    }));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRequest());

    await act(async () => {
      await expect(result.current.execute({ url: "/api/fail" })).rejects.toThrow(
        "Request failed with status 500",
      );
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toContain("500");
    });
  });
});
