import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALES } from "@/i18n/routing";
import type { Locale } from "@/i18n/locale";
import { DocsShell } from "@/components/docs/docs-shell";
import {
  ALL_SLUGS,
  getAllDocs,
  getDocContent,
  getDocMeta,
  isTranslated,
} from "@/lib/docs/registry";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import { getLocaleOption } from "@/lib/locale-meta";

/**
 * Prerender every (locale, page) pair.
 *
 * This is the single most important function for a static docs site: without
 * it, `output: "export"` cannot know which `/docs/...` URLs exist and either
 * fails the build or emits nothing for them. The cross product is locales ×
 * pages, because a page missing in Bengali still resolves to the English file
 * (with a visible notice) rather than 404-ing.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    ALL_SLUGS.map((slug) => ({
      locale,
      // Nested pages are addressed as `slug` segments: `/docs/a/b` becomes
      // `{ locale: "en", slug: ["a", "b"] }`.
      slug: slug.split("/"),
    })),
  );
}

/** Only the params above exist. Anything else is a genuine 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const localeCode = locale as Locale;
  const segments = (slug ?? []).join("/");
  const page = getDocMeta(localeCode, segments);

  if (!page) return {};

  const option = getLocaleOption(localeCode);
  const canonical = `${option.code === DEFAULT_LOCALE ? "" : `/${option.code}`}${page.href}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
      /**
       * Every page is available in every locale (English is the fallback), so
       * each page advertises all three language variants. That is what lets a
       * search engine offer the Bengali version of a page that currently
       * renders English content.
       */
      languages: Object.fromEntries(
        LOCALES.map((code) => [
          code,
          `${code === DEFAULT_LOCALE ? "" : `/${code}`}${page.href}`,
        ]),
      ),
    },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  const localeCode = locale as Locale;
  setRequestLocale(localeCode);

  const segments = (slug ?? []).join("/");
  const meta = getDocMeta(localeCode, segments);
  if (!meta) notFound();

  const Content = await getDocContent(localeCode, segments);
  if (!Content) notFound();

  // Every page in every locale, so the sidebar and prev/next come from one
  // source. `getNeighbours` reads the same list, which is what guarantees the
  // two never disagree.
  const allPages = getAllDocs(localeCode);
  const translated = isTranslated(localeCode, segments);

  return (
    <DocsShell
      locale={localeCode}
      pages={allPages}
      currentHref={meta.href}
      title={meta.title}
      description={meta.description}
      badge={meta.badge}
      /** Surfaced, not hidden — see registry.ts for why. */
      showFallbackNotice={!translated && localeCode !== DEFAULT_LOCALE}
      sourcePath={`content/${localeCode}/docs/${segments}.mdx`}
    >
      <div className="prose-velox">
        <Content />
      </div>
    </DocsShell>
  );
}