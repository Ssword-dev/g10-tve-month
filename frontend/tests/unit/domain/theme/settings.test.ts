import {
  applyThemeMode,
  getStoredThemeMode,
  initializeThemeMode,
  resolveThemeMode,
  setStoredThemeMode,
} from "@/domain/theme/settings";
import { describe, expect, it, vi } from "vitest";

describe("theme settings", () => {
  it("stores and reads valid theme values", () => {
    localStorage.removeItem("sems.theme");

    setStoredThemeMode("dark");
    expect(getStoredThemeMode()).toBe("dark");

    setStoredThemeMode("light");
    expect(getStoredThemeMode()).toBe("light");
  });

  it("returns null for invalid stored value", () => {
    localStorage.setItem("sems.theme", "invalid");
    expect(getStoredThemeMode()).toBeNull();
  });

  it("resolves mode from matchMedia when storage is empty", () => {
    localStorage.removeItem("sems.theme");

    window.matchMedia = vi.fn(() => ({
      matches: true,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    expect(resolveThemeMode()).toBe("dark");
  });

  it("applies theme by toggling root dark class", () => {
    applyThemeMode("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    applyThemeMode("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("initializes mode from storage", () => {
    localStorage.setItem("sems.theme", "dark");
    const mode = initializeThemeMode();

    expect(mode).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
