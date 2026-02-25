import { createServerQuery } from "@/infrastructure/ServerQuery";
import { describe, expect, it, vi } from "vitest";

type DataResponse<T> = { type: "data"; data: T };

function dataResponse<T>(data: T): DataResponse<T> {
  return { type: "data", data };
}

describe("ServerQuery", () => {
  it("runs initial auto-refresh and populates successful state", async () => {
    const queryFn = vi.fn(async (id: number) => dataResponse({ id, value: "ready" }));
    const query = createServerQuery("User:get", queryFn, [7]);

    await vi.waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    expect(queryFn).toHaveBeenCalledWith(7);
    expect(query.getState()).toMatchObject({
      data: { id: 7, value: "ready" },
      error: null,
      isLoading: false,
      isSuccess: true,
    });
  });

  it("refresh uses cache and still performs fetch", async () => {
    let resolver: ((value: DataResponse<{ count: number }>) => void) | null = null;
    let calls = 0;

    const queryFn = vi.fn(() => {
      calls += 1;
      if (calls === 1) {
        return Promise.resolve(dataResponse({ count: 1 }));
      }

      return new Promise<DataResponse<{ count: number }>>((resolve) => {
        resolver = resolve;
      });
    });

    const query = createServerQuery("Counter:get", queryFn, []);
    await vi.waitFor(() => expect(query.getState().isSuccess).toBe(true));

    const updates: Array<{ isLoading: boolean; data: { count: number } | null }> = [];
    const unsubscribe = query.subscribe(() => {
      const state = query.getState();
      updates.push({ isLoading: state.isLoading, data: state.data });
    });

    const refreshPromise = query.refresh();

    await vi.waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
    expect(query.getState().data).toEqual({ count: 1 });
    expect(query.getState().isLoading).toBe(true);

    resolver?.(dataResponse({ count: 2 }));
    await refreshPromise;

    expect(query.getState().data).toEqual({ count: 2 });
    expect(query.getState().isLoading).toBe(false);
    expect(updates.some((update) => update.isLoading && update.data?.count === 1)).toBe(true);

    unsubscribe();
  });

  it("refetch bypasses cache", async () => {
    const queryFn = vi
      .fn<() => Promise<DataResponse<{ value: number }>>>()
      .mockResolvedValueOnce(dataResponse({ value: 1 }))
      .mockResolvedValueOnce(dataResponse({ value: 2 }));

    const query = createServerQuery("Refetch:test", queryFn, []);
    await vi.waitFor(() => expect(query.getState().isSuccess).toBe(true));

    await query.refetch();

    expect(queryFn).toHaveBeenCalledTimes(2);
    expect(query.getState().data).toEqual({ value: 2 });
  });

  it("invalidate removes only targeted args cache and invalidateAll clears all", async () => {
    const queryFn = vi.fn(async (name: string) => dataResponse({ name, nonce: Math.random() }));
    const query = createServerQuery("Invalidate:test", queryFn, ["first"]);

    await vi.waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1));
    await query.refresh("second");
    expect(queryFn).toHaveBeenCalledTimes(2);

    query.invalidate("first");
    await query.refresh("first");
    expect(queryFn).toHaveBeenCalledTimes(3);

    query.invalidateAll();
    await query.refresh("second");
    expect(queryFn).toHaveBeenCalledTimes(4);
  });

  it("supports subscription and unsubscribe", async () => {
    const queryFn = vi.fn(async () => dataResponse({ ok: true }));
    const query = createServerQuery("Subscribe:test", queryFn, []);

    const subscriber = vi.fn();
    const unsubscribe = query.subscribe(subscriber);

    await query.refresh();
    expect(subscriber).toHaveBeenCalled();

    const countBeforeUnsubscribe = subscriber.mock.calls.length;
    unsubscribe();
    await query.refresh();

    expect(subscriber.mock.calls.length).toBe(countBeforeUnsubscribe);
  });

  it("transitions to error state when query throws", async () => {
    const queryFn = vi
      .fn<() => Promise<DataResponse<{ ok: boolean }>>>()
      .mockResolvedValueOnce(dataResponse({ ok: true }))
      .mockRejectedValueOnce(new Error("broken"));

    const query = createServerQuery("Error:test", queryFn, []);
    await vi.waitFor(() => expect(query.getState().isSuccess).toBe(true));

    await query.refetch();

    expect(query.getState().isSuccess).toBe(false);
    expect(query.getState().isLoading).toBe(false);
    expect(query.getState().data).toBeNull();
    expect(query.getState().error?.message).toBe("broken");
  });
});
