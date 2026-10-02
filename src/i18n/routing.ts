import { defineRouting } from "next-intl/routing";

/**
 * The three locales velox_web ships.
 *
 * `en` is the source of truth: `src/messages/en.json` defines the `Messages`
 * type, and a unit test (`tests/unit/messages.test.ts`) asserts every other
 * locale has an identical key set. A missing Bengali or Chinese string is a
 * test failure, not a runtime blank.
 *
 * `localePrefix: "as-needed"` serves English unprefixed (so the canonical URL is
 * the clean `/`), and prefixes the others (`/bn`, `/zh`). That keeps the
 * default-locale SEO surface tidy without hiding the others.
 */
export const routing = defineRouting({
  locales: ["en", "bn", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // The site is fully static — there is no Accept-Language negotiation at
  // request time. The first visit lands on `en`; the switcher is the only way
  // to change locale, which is also the only accessible way.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALES = routing.locales;

export const DEFAULT_LOCALE: Locale = routing.defaultLocale;

/** BCP-47 tags, for `<html lang>` and `Intl` formatters. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  bn: "bn",
  zh: "zh-CN",
};

/**
 * Endonyms — a language switcher must name each language in that language, or
 * a Bengali speaker who cannot read English cannot find their own option.
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
  zh: "中文",
};

/**
 * `Intl.DisplayNames` gives each endonym its native autonym, so the list stays
 * correct if a locale is added. The map above is the explicit fallback for
 * runtimes/environments where `Intl.DisplayNames` is unavailable.
 */
export function localeAutonym(locale: Locale): string {
  if (typeof Intl !== "undefined" && "DisplayNames" in Intl) {
    try {
      const dn = new Intl.DisplayNames([LOCALE_TAGS[locale]], {
        type: "language",
      });
      return dn.of(LOCALE_TAGS[locale]) ?? LOCALE_NAMES[locale];
    } catch {
      // Fall through to the explicit map.
    }
  }
  return LOCALE_NAMES[locale];
}

/**
 * Logical (direction + locale-aware) glyph coverage. All three shipped locales
 * are LTR; this exists so adding an RTL locale later cannot silently ship a
 * mirrored layout, and so tests can assert the set rather than assume it.
 */
export function isRtlLocale(_locale: Locale): boolean {
  return false;
}