import { test, expect } from "@playwright/test";

/**
 * Smoke tests over the exported site.
 *
 * Deliberately behavioural rather than visual: these assert that routes exist,
 * that every string reaches the DOM in all three locales, and that the
 * interactive pieces work. Pixel snapshots would be brittle across font
 * versions and would say nothing about whether the i18n contract holds.
 */

test.describe("static export", () => {
  test("serves the landing page in all three locales", async ({ page }) => {
    // Each locale asserts ITS OWN headline. A shared substring like "Rust"
    // would pass even if all three locales served the English h1, which is
    // precisely the bug this is meant to catch.
    for (const [path, headline] of [
      ["/en/", "paints pixels"],
      ["/bn/", "পিক্সেল"],
      ["/zh/", "像素"],
    ] as const) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should exist`).toBe(200);
      await expect(page.locator("h1")).toContainText(headline);
    }
  });

  test("redirects the bare root to English", async ({ page }) => {
    // `localePrefix: "as-needed"` plus a static export means `/` is not a real
    // page — `scripts/postbuild.mjs` writes a redirect there. `meta refresh`
    // does not produce a navigation Playwright's `goto` observes, so the
    // assertion is on the destination, which is what a visitor actually sees.
    await page.goto("/");
    await page.waitForURL(/\/en\//, { timeout: 10_000 });
    await expect(page.locator("[data-locale]")).toHaveAttribute("lang", "en");
  });

  test("declares the correct lang attribute per locale", async ({ page }) => {
    // The authoritative value is on the [locale] wrapper; the inline script
    // copies it to <html> before paint. Checking the wrapper avoids depending
    // on script execution order.
    await page.goto("/bn/");
    const wrapper = page.locator("[data-locale]");
    await expect(wrapper).toHaveAttribute("lang", "bn");

    await page.goto("/zh/");
    await expect(page.locator("[data-locale]")).toHaveAttribute("lang", "zh-CN");
  });

  test("serves a docs page and its neighbours", async ({ page }) => {
    await page.goto("/en/docs/introduction/");
    await expect(page.locator("h1")).toBeVisible();

    // The h1 must NOT contain the untranslated fallback marker.
    await expect(page.locator("h1")).not.toContainText("MISSING_MESSAGE");

    await expect(
      page.getByRole("navigation", { name: "Pagination" }),
    ).toBeVisible();
  });

  test("localised docs pages carry translated headings", async ({ page }) => {
    await page.goto("/bn/docs/introduction/");
    await expect(page.locator("h1")).toHaveText("ভূমিকা");

    await page.goto("/zh/docs/introduction/");
    await expect(page.locator("h1")).toHaveText("简介");
  });

  test("search filters the docs list", async ({ page }) => {
    await page.goto("/en/docs/");
    const input = page.getByLabel("Search the documentation");
    await input.fill("renderer");

    // Matched by substring, not by exact href. `DocsSearch` renders plain
    // anchors from the registry path (`/docs/renderer`) while the docs index
    // cards go through next-intl's Link and come out as `/docs/renderer/`. A
    // trailing-slash-sensitive locator would pass on one list and fail on the
    // other, which is exactly the kind of flake worth designing out.
    await expect(page.locator("a[href*='/docs/renderer']").first()).toBeVisible();
  });

  test("search reports when nothing matches", async ({ page }) => {
    await page.goto("/en/docs/");
    await page.getByLabel("Search the documentation").fill("zzzznotathing");
    await expect(page.getByText("No pages match that search.")).toBeVisible();
  });

  test("switches locale and lands on the same page", async ({ page }) => {
    await page.goto("/en/docs/introduction/");
    await page.locator("summary").first().click();

    // Assert the href before clicking. The switcher was a <button onClick>,
    // which had no href at all — invisible to crawlers, no new-tab, no status
    // bar destination. A real URL is the whole point, so it is asserted first.
    // `/docs` is a STATIC segment of the route, not a param. Reconstructing the
    // path from useParams() dropped it and produced `/zh/introduction`.
    const zhLink = page.locator("details a[hreflang='zh-CN']");
    await expect(zhLink).toHaveAttribute("href", "/zh/docs/introduction/");

    // The destination must actually exist. Asserting the href alone is not
    // enough — that is how `/zh/introduction` shipped looking correct. Wait for
    // the navigation itself and check its status.
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.request().isNavigationRequest()),
      zhLink.click(),
    ]);
    expect(response.status(), "switched page should not be a 404").not.toBe(404);

    await expect(page).toHaveURL(/\/zh\/docs\/introduction\//);
    await expect(page.locator("[data-locale]")).toHaveAttribute("lang", "zh-CN");
  });

  test("404s an unknown route rather than serving an empty shell", async ({
    page,
  }) => {
    // Under a locale prefix, because an unprefixed unknown path would be the
    // redirect page rather than a 404.
    const response = await page.goto("/en/docs/no-such-page/");
    expect(response?.status()).toBe(404);
  });
});
