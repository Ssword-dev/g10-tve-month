import useIsMobile from "@/hooks/useIsMobile";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it("returns true for mobile viewport", async () => {
    let listener: (() => void) | null = null;

    window.matchMedia = vi.fn(() => ({
      matches: true,
      media: "(max-width: 767px)",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: (_event: string, cb: () => void) => {
        listener = cb;
      },
      removeEventListener: () => {
        listener = null;
      },
      dispatchEvent: () => true,
    })) as unknown as typeof window.matchMedia;

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 375,
    });

    const { result } = renderHook(() => useIsMobile());

    await act(async () => {
      listener?.();
    });

    expect(result.current).toBe(true);
  });

  it("reacts to media-query changes", async () => {
    let listener: (() => void) | null = null;

    window.matchMedia = vi.fn(() => ({
      matches: false,
      media: "(max-width: 767px)",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: (_event: string, cb: () => void) => {
        listener = cb;
      },
      removeEventListener: () => {
        listener = null;
      },
      dispatchEvent: () => true,
    })) as unknown as typeof window.matchMedia;

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1200,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    await act(async () => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 500,
      });
      listener?.();
    });

    expect(result.current).toBe(true);
  });
});
