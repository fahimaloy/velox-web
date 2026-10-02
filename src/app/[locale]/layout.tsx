import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { assertValidLocale, LOCALE_TAGS, toLocale } from "@/i18n/locale";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Atmosphere } from "@/components/layout/atmosphere";

/**
 * Prerender every locale.
 *
 * Without this, `[locale]` is a dynamic segment with no known params and
 * `output: "export"` refuses to build. Returning the locale list here is what
 * makes `/`, `/bn/*` and `/zh/*` real files in `out/`.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * `dynamicParams: false` turns any locale not listed above into a 404 instead
 * of an attempt to render it on demand — which, with no server, could only
 * fail confusingly at request time.
 */
export const dynamicParams = false;

/**
 * Resolve the locale at build time.
 *
 * `setRequestLocale` is what next-intl needs in every layout and page that
 * reads messages, so they resolve during the static render instead of trying
 * to read a request. Skipping it is the usual cause of
 * "Couldn't find next-intl locale" errors on a static export.
 */
function resolveLocale(param: string) {
  assertValidLocale(param);
  return param;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(toLocale(raw));
  // MUST come before `getMessages()` below. `setRequestLocale` pins the locale
  // into next-intl's per-request store; without it, `getMessages` falls back
  // to reading the request headers, which a static export does not have, and
  // the build fails with `couldn't be rendered statically because it used
  // headers()`.
  setRequestLocale(locale);

  if (!routing.locales.includes(locale)) notFound();

  // Resolved here rather than in the root layout because the root layout is
  // above the `[locale]` segment and cannot know which locale it is rendering.
  const messages = await getMessages();

  return (
    // `data-locale` + `lang` is the authoritative, statically-rendered language
    // declaration. All CSS that varies by script keys off this attribute, and
    // the small script in the root layout copies it up to <html>.
    <div data-locale={locale} lang={LOCALE_TAGS[locale]} className="contents">
      {/* Locale-scoped messages and formatting for client components. It must
          wrap the client components below, so it lives at the top of the
          locale tree rather than around individual pages. */}
      <NextIntlClientProvider
        messages={messages}
        locale={locale}
        timeZone="UTC"
      >
      <Atmosphere />
      <a
        href="#main"
        className={cnSkip()}
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </div>
      </NextIntlClientProvider>
    </div>
  );
}

/** Keyboard users must be able to jump past the nav in one keystroke. */
function cnSkip() {
  return [
    "sr-only",
    "focus:not-sr-only",
    "focus:fixed focus:start-4 focus:top-4 focus:z-[100]",
    "focus:bg-accent focus:px-4 focus:py-2 focus:text-canvas",
    "focus:font-medium",
  ].join(" ");
}