declare module "vitest-environment-puppeteer/global-init" {
  export function setup(ctx: unknown): Promise<void>;
  export function teardown(): Promise<void>;
}
