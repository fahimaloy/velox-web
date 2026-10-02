import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_OPTIONS, localePath } from "@/i18n/locale";

/**
 * The language switcher must be real links.
 *
 * It shipped as `<button onClick={...}>` doing `window.location.href = ...`.
 * Functionally that worked in a browser, but it meant: no `href`, so no
 * crawler could follow it, no middle-click or Cmd-click to open the language in
 * a new tab, and no destination shown in the status bar. The three locales are
 * genuinely separate static files at genuinely separate URLs — an anchor is
 * the element that matches.
 */
const SRC = readFileSync(
  join(process.cwd(), "src/components/layout/language-switcher.tsx"),
  "utf8",
);

/**
 * The file with block comments stripped.
 *
 * Necessary: this component's comments discuss `<button onClick>` — the exact
 * thing the first test forbids — so matching the raw source would make the
 * comment about the fix trip the check for the bug. A test that fails on its
 * own explanatory prose is a test nobody will keep.
 */
const CODE = SRC.replace(/\/\*[\s\S]*?\*\//g, "");

describe("language switcher", () => {
  it("renders anchors, not buttons", () => {
    expect(CODE).not.toMatch(/<button/);
    expect(CODE).toMatch(/<a[\s\S]*?href=\{hrefFor\(/);
  });

  it("does not hand-roll navigation with window.location", () => {
    // A real href makes the browser do this natively, which is both better for
    // the user and one less thing to get wrong.
    expect(CODE).not.toMatch(/window\.location/);
  });

  it("builds a working URL for every locale", () => {
    // `localePath` leaves the DEFAULT locale unprefixed by design
    // (`localePrefix: "as-needed"`), so English is `/docs/introduction` and
    // only bn/zh carry a prefix. The unprefixed path is the postbuild redirect,
    // which resolves to the same page.
    const byCode = Object.fromEntries(
      LOCALE_OPTIONS.map(({ code }) => [code, localePath(code, "/docs/introduction")]),
    );
    expect(byCode).toEqual({
      en: "/docs/introduction",
      bn: "/bn/docs/introduction",
      zh: "/zh/docs/introduction",
    });
  });

  /**
   * The static-segment bug, pinned.
   *
   * `useParams()` returns only DYNAMIC segments. For `/en/docs/introduction/`
   * that is `{ locale, slug }` — `/docs` is a static route segment and is
   * never returned, so rebuilding the path from params yielded
   * `/zh/introduction`, a 404. The switcher must use `usePathname`, which
   * preserves static segments.
   */
  it("uses usePathname, not useParams", () => {
    expect(CODE).not.toMatch(/useParams/);
    expect(CODE).toMatch(/usePathname/);
  });

  it("keeps static route segments when switching locale", () => {
    // The property that actually broke: `/docs` must survive.
    expect(localePath("zh", "/docs/introduction")).toBe("/zh/docs/introduction");
    expect(localePath("bn", "/docs/renderer/paint")).toBe(
      "/bn/docs/renderer/paint",
    );
    expect(localePath("zh", "/")).toBe("/zh");
  });

  it("gives every locale a distinct autonym", () => {
    // A language picker that shows two identical labels is useless. Guards the
    // Intl.DisplayNames path, whose output varies by ICU build — the zh label
    // came back as "Chinese (China)" on one machine and "中文" on another.
    const seen = new Map<string, string>();
    for (const { code, autonym } of LOCALE_OPTIONS) {
      const clash = seen.get(autonym);
      expect(clash, `${code} and ${clash} share autonym "${autonym}"`).toBe(
        undefined,
      );
      seen.set(autonym, code);
    }
  });
});
