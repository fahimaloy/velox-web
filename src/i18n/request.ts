import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Request configuration for next-intl.
 *
 * `getRequestConfig` runs once per locale at build time for this site. The
 * `locale` it receives comes from the `[locale]` route segment.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // A future locale with a different date/number convention picks this up
    // automatically; today all three share the Gregorian calendar and Latin
    // digits, but Bengali numerals are a per-locale preference, not a global.
    formats: {
      number: {
        currency: {
          style: "currency",
          currency: "USD",
          notation: "standard",
        },
      },
    },
  };
});