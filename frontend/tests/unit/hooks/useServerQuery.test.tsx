import useServerQuery from "@/hooks/useServerQuery";
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("useServerQuery", () => {
  it("mirrors server query state updates", async () => {
    let state = {
      data: null as { id: number } | null,
      error: null as Error | null,
      isLoading: true,
      isSuccess: false,
    };

    let subscriber: (() => void) | null = null;

    const serverQuery = {
      key: "Test:query",
      getState: vi.fn(() => state),
      refresh: vi.fn(async () => {}),
      refetch: vi.fn(async () => {}),
      invalidate: vi.fn(),
      invalidateAll: vi.fn(),
      subscribe: vi.fn((next: () => void) => {
        subscriber = next;
        return () => {
          subscriber = null;
        };
      }),
    };

    const { result } = renderHook(() => useServerQuery(serverQuery));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();

    state = {
      data: { id: 42 },
      error: null,
      isLoading: false,
      isSuccess: true,
    };

    await act(async () => {
      subscriber?.();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual({ id: 42 });
  });

  it("passes through refresh/refetch/invalidate/invalidateAll", async () => {
    const serverQuery = {
      key: "Test:query",
      getState: vi.fn(() => ({
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
      })),
      refresh: vi.fn(async (..._args: [number]) => {}),
      refetch: vi.fn(async (..._args: [number]) => {}),
      invalidate: vi.fn((..._args: [number]) => {}),
      invalidateAll: vi.fn(),
      subscribe: vi.fn(() => () => {}),
    };

    const { result } = renderHook(() =>
      useServerQuery(serverQuery as unknown as Parameters<typeof useServerQuery>[0]),
    );

    await act(async () => {
      await result.current.refresh(1);
      await result.current.refetch(2);
    });

    act(() => {
      result.current.invalidate(3);
      result.current.invalidateAll();
    });

    expect(serverQuery.refresh).toHaveBeenCalledWith(1);
    expect(serverQuery.refetch).toHaveBeenCalledWith(2);
    expect(serverQuery.invalidate).toHaveBeenCalledWith(3);
    expect(serverQuery.invalidateAll).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", () => {
    const unsubscribe = vi.fn();

    const serverQuery = {
      key: "Test:query",
      getState: vi.fn(() => ({
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
      })),
      refresh: vi.fn(async () => {}),
      refetch: vi.fn(async () => {}),
      invalidate: vi.fn(),
      invalidateAll: vi.fn(),
      subscribe: vi.fn(() => unsubscribe),
    };

    const { unmount } = renderHook(() => useServerQuery(serverQuery));

    unmount();

    expect(serverQuery.subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
