import { describe, it, expect } from "vitest";
import {
  ALL_SLUGS,
  getAllDocs,
  getCoverage,
  getDocMeta,
  isTranslated,
  slugToHref,
  hrefToSlug,
} from "@/lib/docs/registry";
import {
  docMetaSchema,
  getNeighbours,
  sortPages,
  groupBySection,
} from "@/lib/docs/types";
import { LOCALES } from "@/i18n/routing";

/**
 * Content integrity.
 *
 * A docs site's failure modes are mostly quiet: a page missing from the
 * sidebar, a duplicate `order` that shuffles between builds, a slug that
 * resolves to the wrong URL. None of those throw. These tests make them fail
 * loudly instead.
 */

describe("doc metadata", () => {
  for (const slug of ALL_SLUGS) {
    it(`/${slug} has valid frontmatter`, () => {
      const page = getDocMeta("en", slug);
      expect(page, `${slug} is missing from the registry`).toBeDefined();

      const result = docMetaSchema.safeParse({
        title: page!.title,
        description: page!.description,
        order: page!.order,
        section: page!.section,
      });
      expect(
        result.success,
        `${slug} frontmatter invalid: ${JSON.stringify(result.error?.issues)}`,
      ).toBe(true);
    });

    it(`/${slug} has a title and description`, () => {
      const page = getDocMeta("en", slug)!;
      expect(page.title.trim().length).toBeGreaterThan(0);
      expect(page.description.trim().length).toBeGreaterThan(10);
    });
  }

  it("has no duplicate order values", () => {
    // Duplicates would make prev/next pairing depend on the sort tiebreak
    // rather than on the author's intent, and any title edit silently reorders
    // the sidebar.
    const orders = getAllDocs("en").map((p) => p.order);
    expect(new Set(orders).size, "duplicate `order` values").toBe(orders.length);
  });

  it("orders the docs into a sensible reading order", () => {
    const pages = sortPages(getAllDocs("en"));
    expect(pages[0].href).toBe("/docs/introduction");

    // Getting-started must precede the guides that build on it.
    const installIdx = pages.findIndex((p) => p.href.includes("installation"));
    const quickStartIdx = pages.findIndex((p) => p.href.includes("quick-start"));
    const sfcIdx = pages.findIndex((p) => p.href.includes("single-file-components"));
    expect(installIdx).toBeLessThan(quickStartIdx);
    expect(quickStartIdx).toBeLessThan(sfcIdx);
  });

  it("returns undefined for an unknown slug rather than throwing", () => {
    expect(getDocMeta("en", "does-not-exist")).toBeUndefined();
    expect(getDocMeta("en", "")).toBeUndefined();
  });
});

describe("slug helpers", () => {
  it("round-trips slug and href", () => {
    for (const slug of ["introduction", "quick-start", "a/b/c"]) {
      const href = slugToHref(slug.split("/"));
      expect(hrefToSlug(href)).toEqual(slug.split("/"));
    }
  });

  it("maps the docs root correctly", () => {
    expect(slugToHref([])).toBe("/docs");
    expect(hrefToSlug("/docs")).toEqual([]);
  });
});

describe("navigation", () => {
  const pages = getAllDocs("en");

  it("gives every page neighbours except the ends", () => {
    for (const page of pages) {
      const { previous, next } = getNeighbours(pages, page);
      if (previous) expect(previous.order).toBeLessThanOrEqual(page.order);
      if (next) expect(next.order).toBeGreaterThanOrEqual(page.order);
    }
  });

  it("chains prev/next into a complete walk", () => {
    const sorted = sortPages(pages);
    for (let i = 1; i < sorted.length; i++) {
      const { previous } = getNeighbours(sorted, sorted[i]);
      expect(previous?.href, `page ${sorted[i].href} has no previous`).toBe(sorted[i - 1].href);
    }
  });
});

describe("sidebar grouping", () => {
  it("returns sections in display order, dropping empty ones", () => {
    const groups = groupBySection(getAllDocs("en"));
    // Asserted against SECTIONS explicitly. Sorting the ids alphabetically
    // would assert ["guide","internals","reference","start"] — a different and
    // wrong order, since the sidebar reads top-to-bottom as
    // start → guide → reference → internals.
    expect(groups.map((g) => g.id)).toEqual([
      "start",
      "guide",
      "reference",
      "internals",
    ]);
    for (const group of groups) expect(group.pages.length).toBeGreaterThan(0);
  });

  it("places every page in exactly one group", () => {
    const groups = groupBySection(getAllDocs("en"));
    const total = groups.reduce((sum, g) => sum + g.pages.length, 0);
    expect(total).toBe(ALL_SLUGS.length);
  });
});

describe("translation coverage", () => {
  it("reports coverage for every locale", () => {
    const coverage = getCoverage();
    for (const locale of LOCALES) {
      expect(coverage[locale], `no coverage for ${locale}`).toBeDefined();
      expect(coverage[locale].total).toBe(ALL_SLUGS.length);
      expect(coverage[locale].translated).toBeGreaterThanOrEqual(0);
    }
  });

  it("marks English as the complete source", () => {
    expect(getCoverage().en.translated).toBe(ALL_SLUGS.length);
  });

  it("only marks a locale translated when its file exists", () => {
    // introduction is translated in all three; architecture only in English.
    expect(isTranslated("en", "introduction")).toBe(true);
    expect(isTranslated("bn", "introduction")).toBe(true);
    expect(isTranslated("zh", "architecture")).toBe(false);
  });
});
