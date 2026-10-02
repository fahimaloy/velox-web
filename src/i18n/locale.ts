import { z } from "zod";
import {
  routing,
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_TAGS,
  LOCALE_NAMES,
  localeAutonym,
  isRtlLocale,
  type Locale,
} from "./routing";

/**
 * Locale metadata for the switcher and for `<html lang>`.
 *
 * `Intl.DisplayNames` gives each language its own autonym ("বাংলা", not
 * "Bengali"), which is the only correct way to label a language picker for a
 * reader who may not read English. The explicit map is the fallback.
 */
export interface LocaleOption {
  /** URL segment, e.g. "bn". */
  code: Locale;
  /** BCP-47 tag for `lang` attributes and `Intl` formatters. */
  tag: string;
  /** The language's name, in that language. */
  autonym: string;
  /** English name — used only in `aria-label`s for assistive tech. */
  englishName: string;
  dir: "ltr" | "rtl";
}

export const LOCALE_OPTIONS: readonly LocaleOption[] = LOCALES.map((code) => ({
  code,
  tag: LOCALE_TAGS[code],
  autonym: localeAutonym(code),
  englishName: LOCALE_NAMES[code],
  dir: isRtlLocale(code) ? "rtl" : "ltr",
}));

/** Narrow an arbitrary string to a supported locale, defaulting to `en`. */
export function toLocale(value: unknown): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}

/** Build a locale-prefixed href for a raw, locale-less pathname. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  // English is served unprefixed (`localePrefix: "as-needed"`), so `/` and
  // `/docs/cli` stay clean. Prefixing them would make the canonical URL for
  // the default language carry a redundant `/en`.
  if (locale === DEFAULT_LOCALE) {
    return clean === "/" ? "/" : clean;
  }
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/**
 * Swap the locale in a path while keeping the route.
 *
 * The language switcher calls this so switching from `/bn/docs/cli` to `zh`
 * lands on `/zh/docs/cli` — not on the homepage. `pathname` here must be the
 * locale-stripped pathname (which is what next-intl's `usePathname` returns).
 */
export function switchLocalePathname(pathname: string, next: Locale): string {
  return localePath(next, pathname);
}

/** Parse a pathname into its slug segments, dropping empties. */
export function pathToSlug(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

/** Join slug segments back into a canonical, locale-less pathname. */
export function slugToPath(slug: readonly string[]): string {
  return slug.length ? `/${slug.join("/")}` : "/";
}

/**
 * Zod schema for the locale. Used to validate route params at build time: a
 * bad `[locale]` value should fail `next build`, not render a page in the
 * wrong language.
 *
 * `defineRouting` returns `locales` as `readonly Locale[]`; `z.enum` wants a
 * mutable tuple. The `[...LOCALES]` spread satisfies that without lying to the
 * type system with an `as` cast.
 */
export const localeSchema = z.enum([...LOCALES] as [Locale, ...Locale[]]);

export function assertValidLocale(value: unknown): asserts value is Locale {
  const parsed = localeSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error(
      `Unsupported locale ${JSON.stringify(value)}. Supported: ${LOCALES.join(", ")}.`,
    );
  }
}

export { routing, LOCALES, DEFAULT_LOCALE, LOCALE_TAGS, LOCALE_NAMES };
export type { Locale };