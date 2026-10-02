import { LOCALE_OPTIONS, type Locale } from "@/i18n/locale";

/**
 * Server-side locale metadata.
 *
 * Split from `i18n/locale.ts` on purpose. That module imports from
 * `next-intl/routing` and is fine in both environments, but this one is used
 * from Server Components that need an `Intl` tag for `toLocaleString` — and
 * bundling the whole routing module into a server component just to read a
 * locale tag is wasteful.
 *
 * `Intl.NumberFormat` here is load-bearing, not decoration: the crate line
 * counts render as "12,961" in English, "১২,৯৬১" in Bengali and "12,961" in
 * Chinese depending on locale. Numbers formatted with the active locale's
 * conventions is a small thing that immediately signals the site was built for
 * its readers rather than translated after the fact.
 */
export function getLocaleOption(locale: Locale) {
  const option = LOCALE_OPTIONS.find((o) => o.code === locale);
  if (!option) {
    throw new Error(
      `No locale metadata for ${JSON.stringify(locale)}. Did you add a locale to routing.ts without adding it to LOCALE_NAMES?`,
    );
  }
  return option;
}

/**
 * Format a number in the active locale's conventions.
 *
 * Used for crate line counts, test counts and any other figure that appears in
 * prose. `undefined` locales fall back to the default locale rather than
 * throwing — a missing locale should degrade the number's separators, not take
 * the page down.
 */
export function formatNumber(value: number, locale: Locale): string {
  const tag = getLocaleOption(locale).tag;
  return new Intl.NumberFormat(tag).format(value);
}