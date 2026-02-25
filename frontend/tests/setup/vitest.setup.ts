import "@testing-library/jest-dom/vitest";

const e2eApiBaseUrl = process.env.VITEST_E2E_BASE_URL ?? "http://127.0.0.1:8000";
const originalFetch = globalThis.fetch;

if (typeof originalFetch === "function") {
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api/")) {
      const apiPath = input.slice("/api/".length);
      return originalFetch(`${e2eApiBaseUrl}/${apiPath}`, init);
    }

    if (input instanceof URL && input.pathname.startsWith("/api/")) {
      const apiPath = input.pathname.slice("/api/".length);
      return originalFetch(`${e2eApiBaseUrl}/${apiPath}${input.search}`, init);
    }

    return originalFetch(input, init);
  };
}

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  class IntersectionObserverMock implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];

    disconnect(): void {}

    observe(_target: Element): void {}

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve(_target: Element): void {}
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
}
