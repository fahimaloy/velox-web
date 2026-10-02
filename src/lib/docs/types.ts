import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { z } from "zod";
import { LOCALES, type Locale } from "@/i18n/routing";

/**
 * Docs frontmatter, validated.
 *
 * Zod rather than a TypeScript interface because a type only checks the code
 * that reads it — it cannot check the file. A missing `title`, a duplicated
 * `order`, or a `section` that does not match a known group should fail the
 * build, not produce a sidebar with an untitled entry and a silently wrong
 * sort. `tests/unit/content.test.ts` asserts this schema is applied to every
 * page in every locale.
 */
export const docMetaSchema = z.object({
  /** H1. Required — a docs page without a title is a bug, not a style choice. */
  title: z.string().min(1, "frontmatter.title must not be empty"),

  /** Meta description and search-result blurb. */
  description: z.string().min(1, "frontmatter.description must not be empty"),

  /** Sort position within the whole docs tree. Lower comes first. */
  order: z.number().int().nonnegative(),

  /** Sidebar group. Adding one here is how a new group appears. */
  section: z.enum(["start", "guide", "reference", "internals"]),

  /**
   * Rendered as a small marker next to the sidebar entry and the page title.
   * Used honestly: "planned" means it is not implemented yet, and the copy
   * around it says so.
   */
  badge: z.enum(["new", "planned", "beta"]).optional(),

  /** Optional override for the sidebar label when it must be shorter. */
  navTitle: z.string().min(1).optional(),

  /** Estimated reading time in minutes. Displayed, never used for logic. */
  readingMinutes: z.number().int().positive().optional(),
});

export type DocMeta = z.infer<typeof docMetaSchema>;

/** A docs page: its slug, where it lives, and its validated metadata. */
export interface DocPage extends DocMeta {
  /** Path segments after /docs. `["cli"]` → /docs/cli. */
  slug: string[];
  /** Full, locale-less path. Always starts with `/docs`. */
  href: string;
  locale: Locale;
  /**
   * The MDX component for the body.
   *
   * Typed as returning `ReactNode`, NOT `unknown`. An `unknown` return is not
   * a valid JSX component type, so `<Content />` fails to typecheck — and the
   * tempting "fix" is an `any` cast, which would hide every real prop mistake
   * in every doc page from that point on.
   */
  Content: ComponentType<{ components?: MDXComponents }>;
}

/** Sidebar groups, in display order. */
export const SECTIONS = [
  { id: "start", label: "Getting started" },
  { id: "guide", label: "Guides" },
  { id: "reference", label: "Reference" },
  { id: "internals", label: "Internals" },
] as const satisfies ReadonlyArray<{ id: DocMeta["section"]; label: string }>;

export const SECTION_IDS = SECTIONS.map((s) => s.id);

/**
 * Order pages for the sidebar and for prev/next navigation.
 *
 * Sorted by `order` first and `title` as the tiebreak, so two pages that share
 * an order still sort deterministically. Determinism matters more than it
 * looks: a non-deterministic sort makes the prev/next pairings change between
 * builds, which produces links that point somewhere else after a rebuild.
 */
export function sortPages(pages: readonly DocPage[]): DocPage[] {
  return [...pages].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );
}

/**
 * Group pages into sidebar sections, dropping empty groups.
 *
 * Dropping empty groups is what keeps `label` out of the message catalogs: the
 * section names are structural, not translated prose, so a new section gets a
 * label from `SECTIONS` rather than requiring three new keys in three JSON
 * files. Translated prose lives in the catalogs; structure does not.
 */
export function groupBySection(pages: readonly DocPage[]) {
  const sorted = sortPages(pages);
  return SECTIONS.map((section) => ({
    ...section,
    pages: sorted.filter((page) => page.section === section.id),
  })).filter((section) => section.pages.length > 0);
}

/**
 * The page before and after `current` in reading order.
 *
 * Prev/next is computed from the same sorted list the sidebar renders, so the
 * two can never disagree — a very common source of docs navigation bugs when
 * the two are computed independently.
 */
export function getNeighbours(
  pages: readonly DocPage[],
  current: DocPage,
): { previous?: DocPage; next?: DocPage } {
  const sorted = sortPages(pages);
  const index = sorted.findIndex(
    (page) => page.locale === current.locale && page.href === current.href,
  );
  if (index === -1) return {};
  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

/** Which locales the content layer is allowed to serve. Re-exported for tests. */
export const CONTENT_LOCALES = LOCALES;