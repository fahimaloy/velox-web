import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Asserts the SHIPPED HTML contains no unresolved translation markers.
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT REDUNDANT WITH THE OTHER i18n TEST
 * --------------------------------------------------------------------
 * `next build` exits 0 even when next-intl cannot resolve a key. It prints a
 * `MISSING_MESSAGE` block to stderr and moves on. So "the build passed" was
 * true while four pipeline stages rendered the literal string
 * `MISSING_MESSAGE` into the Chinese page — and the unit suite was green too,
 * because the other test validated the keys against a hardcoded stage list
 * that did not match the source.
 *
 * The unit test catches a missing key going forward. THIS test catches what
 * actually reaches the user: it reads the exported files, which is the only
 * artifact the deploy target serves.
 *
 * SKIPPED WHEN `out/` IS ABSENT so a bare `pnpm test` (no prior build) does
 * not fail for an unrelated reason. CI runs `pnpm check`, which builds last.
 */
const OUT = join(process.cwd(), "out");

/** Recursively collect `.html` files, skipping the JS bundles. */
function htmlFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) htmlFiles(full, acc);
    else if (entry.endsWith(".html")) acc.push(full);
  }
  return acc;
}

describe.skipIf(!existsSync(OUT))("exported site", () => {
  const pages = existsSync(OUT) ? htmlFiles(OUT) : [];

  it("produced HTML output", () => {
    expect(pages.length, "no HTML found in out/ — build has not run").toBeGreaterThan(0);
  });

  for (const page of pages) {
    const name = relative(OUT, page);
    it(`${name} has no MISSING_MESSAGE`, () => {
      const html = readFileSync(page, "utf8");
      const offenders = [...html.matchAll(/MISSING_MESSAGE[^"<]*/g)].map(
        (m) => m[0],
      );
      expect(
        offenders,
        `${name} renders unresolved message keys: ${[...new Set(offenders)].join(", ")}`,
      ).toEqual([]);
    });
  }

  it("ships all three locales under their prefix", () => {
    // Every locale exports under an explicit prefix, INCLUDING English:
    // `out/en/index.html`, `out/bn/…`, `out/zh/…`. There is no
    // `out/index.html`.
    //
    // `localePrefix: "as-needed"` makes the unprefixed URL (`/en`) RESOLVE to
    // the same file, but the export still writes the prefixed path. So a host
    // that serves `out/` verbatim will 404 on `/` until it is told to map the
    // root onto `/en` — see README "Deploying" for the per-host snippet.
    // Asserting the real layout here is what catches a change to that
    // behaviour, which would otherwise only show up as a blank homepage.
    for (const locale of ["en", "bn", "zh"]) {
      expect(
        existsSync(join(OUT, locale, "index.html")),
        `${locale} landing page missing`,
      ).toBe(true);
    }
  });
});
