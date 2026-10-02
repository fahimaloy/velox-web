import { describe, it, expect } from "vitest";
import en from "@/messages/en.json";
import bn from "@/messages/bn.json";
import zh from "@/messages/zh.json";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/routing";

/**
 * Message catalog parity.
 *
 * These tests exist because a missing translation is the single most likely
 * i18n bug to reach production: next-intl renders a missing key as
 * `MISSING_MESSAGE` rather than throwing in production, so nothing fails
 * loudly. A catalog drift turns a Bengali page into a page with English
 * fragments and a build-time-visible test failure.
 */

type Json = { [key: string]: string | Json };

/** Every leaf path in a catalog, as dotted keys. */
function leafKeys(node: Json, prefix = ""): string[] {
  return Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : leafKeys(value, path);
  });
}

const catalogs: Record<string, Json> = { en, bn, zh };
const source = leafKeys(en);

describe("message catalogs", () => {
  it("has a source catalog with a non-trivial number of keys", () => {
    // A sanity floor. If this ever drops below ~100 something has deleted the
    // catalog rather than edited it.
    expect(source.length).toBeGreaterThan(100);
  });

  for (const locale of LOCALES) {
    it(`${locale} has exactly the same keys as ${DEFAULT_LOCALE}`, () => {
      const target = leafKeys(catalogs[locale]);
      const missing = source.filter((key) => !target.includes(key));
      const extra = target.filter((key) => !source.includes(key));

      expect(missing, `${locale} is missing keys`).toEqual([]);
      expect(extra, `${locale} has keys absent from ${DEFAULT_LOCALE}`).toEqual([]);
    });
  }

  for (const locale of LOCALES) {
    it(`${locale} has no empty strings`, () => {
      const empty = source.filter((key) => {
        const value = key
          .split(".")
          .reduce<unknown>((node, part) => (node as Json)?.[part], catalogs[locale]);
        return typeof value === "string" && value.trim() === "";
      });
      expect(empty, `${locale} has blank translations`).toEqual([]);
    });
  }

  it("non-English catalogs are actually translated, not copied", () => {
    // Catches the copy-paste-paste-English failure mode. A handful of keys are
    // legitimately identical across locales (crate names, code identifiers),
    // so this asserts on the bulk rather than demanding zero overlap.
    for (const locale of ["bn", "zh"] as const) {
      const same = source.filter(
        (key) =>
          key.split(".").reduce<unknown>((n, p) => (n as Json)?.[p], en) ===
          key.split(".").reduce<unknown>((n, p) => (n as Json)?.[p], catalogs[locale]),
      );
      const ratio = same.length / source.length;
      expect(ratio, `${locale} looks mostly untranslated (${same.length}/${source.length})`)
        .toBeLessThan(0.25);
    }
  });
});
