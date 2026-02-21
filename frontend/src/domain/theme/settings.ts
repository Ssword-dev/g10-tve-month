export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "sems.theme";

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function getStoredThemeMode(): ThemeMode | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(value) ? value : null;
  } catch {
    return null;
  }
}

export function setStoredThemeMode(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors (private mode / blocked storage).
  }
}

export function resolveThemeMode(): ThemeMode {
  const stored = getStoredThemeMode();
  if (stored) {
    return stored;
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export function applyThemeMode(mode: ThemeMode): void {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
}

export function initializeThemeMode(): ThemeMode {
  const mode = resolveThemeMode();
  applyThemeMode(mode);
  return mode;
}
