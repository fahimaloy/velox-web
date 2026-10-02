import { defineConfig, devices } from "@playwright/test";

/**
 * E2E configuration.
 *
 * Tests run against the STATIC EXPORT, served by a plain file server — not
 * against `next dev` and not against `next start`.
 *
 * That distinction matters. `next dev` tolerates things a static host does
 * not: a request-time middleware, a missing generateStaticParams entry, a
 * route that only works because the dev server is still running. Testing the
 * actual `out/` directory is the only way to know the deployable artifact
 * works, and it is what the deploy target will serve.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],

  /**
   * Builds first, then serves `out/` — mirroring what Cloudflare Pages, GitHub
   * Pages and Netlify will do with the same files.
   *
   * THE BUILD IS INSIDE webServer, NOT A SEPARATE STEP, ON PURPOSE.
   *
   * Running `pnpm build` as a separate command, then `playwright test`, silently
   * tests whatever `out/` happens to contain. When a typecheck failure aborted
   * the build, E2E still ran — happily asserting against an export from an
   * earlier commit, and reporting a confusing failure about code that no longer
   * existed. An E2E run that cannot report "the build is broken" is worse than
   * no E2E run, because it looks like coverage.
   *
   * So the build is a precondition of serving. If the build fails, `out/` is not
   * refreshed, the server does not come up healthy, and the run fails at the
   * webServer stage with the real cause.
   *
   * `reuseExistingServer: false` for the same reason — a server left over from
   * an earlier run would serve stale files behind a green run.
   */
  webServer: {
    command: "pnpm build && npx serve out -l 4173 --no-clipboard",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
