// Theme mode configuration.
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

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  )?.matches;
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

// Font size configuration.
export type FontSize = "small" | "medium" | "large";
const DEFAULT_FONT_SIZE: FontSize = "medium";
const FONT_SIZE_STORAGE_KEY = "sems.fontSize";

function isFontSize(value: unknown): value is FontSize {
  return value === "small" || value === "medium" || value === "large";
}

export function getStoredFontSize(): FontSize | null {
  try {
    const value = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    return isFontSize(value) ? value : null;
  } catch {
    return null;
  }
}

export function setStoredFontSize(size: FontSize): void {
  try {
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
  } catch {
    // Ignore storage errors (private mode / blocked storage).
  }
}

export function resolveFontSize(): FontSize {
  const stored = getStoredFontSize();
  return stored ?? DEFAULT_FONT_SIZE;
}

export function applyFontSize(size: FontSize): void {
  const root = document.documentElement;
  root.classList.remove("font-small", "font-medium", "font-large");
  root.classList.add(`font-${size}`);
}

export function initializeFontSize(): FontSize {
  const size = resolveFontSize();
  applyFontSize(size);
  return size;
}

// Contrast configuration.
export type ContrastLevel = "low" | "normal" | "high";
const DEFAULT_CONTRAST_LEVEL: ContrastLevel = "normal";
const CONTRAST_STORAGE_KEY = "sems.contrast";

function isContrastLevel(value: unknown): value is ContrastLevel {
  return value === "low" || value === "normal" || value === "high";
}

export function getStoredContrastLevel(): ContrastLevel | null {
  try {
    const value = window.localStorage.getItem(CONTRAST_STORAGE_KEY);
    return isContrastLevel(value) ? value : null;
  } catch {
    return null;
  }
}

export function setStoredContrastLevel(level: ContrastLevel): void {
  try {
    window.localStorage.setItem(CONTRAST_STORAGE_KEY, level);
  } catch {
    // Ignore storage errors (private mode / blocked storage).
  }
}

export function resolveContrastLevel(): ContrastLevel {
  const stored = getStoredContrastLevel();
  return stored ?? DEFAULT_CONTRAST_LEVEL;
}

export function applyContrastLevel(level: ContrastLevel): void {
  const root = document.documentElement;
  root.classList.remove("contrast-low", "contrast-normal", "contrast-high");
  root.classList.add(`contrast-${level}`);
}

export function initializeContrastLevel(): ContrastLevel {
  const level = resolveContrastLevel();
  applyContrastLevel(level);
  return level;
}
