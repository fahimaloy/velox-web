import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALES } from "@/i18n/routing";
import type { Locale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/panel";
import { DocsSearch } from "@/components/docs/docs-search";
import { getAllDocs, getCoverage, isTranslated } from "@/lib/docs/registry";
import { groupBySection } from "@/lib/docs/types";
import { formatNumber } from "@/lib/locale-meta";

/**
 * Prerender `/docs` in every locale. No slug segment, so a single param.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docsIndex" });
  return { title: t("title"), description: t("description") };
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  if (!LOCALES.includes(locale)) notFound();

  const t = await getTranslations();
  const pages = getAllDocs(locale);
  const groups = groupBySection(pages);
  const coverage = getCoverage()[locale];

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:py-20">
      <SectionHeading
        kicker="documentation"
        title={t("docsIndex.title")}
        description={t("docsIndex.description")}
      />

      <div className="mt-10">
        {/* The page list is passed as props, not fetched: on a static site
            that keeps search working with no network round trip at all. */}
        <DocsSearch pages={pages} />
      </div>

      {/*
        Coverage is shown, not hidden. A reader landing on a Bengali page that
        fell back to English should be able to see at a glance that this is a
        partial translation rather than a broken page.
      */}
      <p className="mt-4 text-sm text-faint">
        {t("docsIndex.coverage", {
          translated: formatNumber(coverage.translated, locale),
          total: formatNumber(coverage.total, locale),
        })}
      </p>

      <div className="mt-14 space-y-14">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`section-${group.id}`}>
            <h2
              id={`section-${group.id}`}
              className="border-b border-line-strong pb-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint"
            >
              {group.label}
            </h2>

            <ul className="mt-5 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
              {group.pages.map((page) => {
                const fallback = !isTranslated(locale, page.slug.join("/"));
                return (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="flex h-full flex-col bg-canvas p-5 transition-colors hover:bg-panel"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-display text-base font-semibold tracking-tight">
                          {page.title}
                        </span>
                        {fallback && locale !== "en" ? (
                          <span
                            aria-hidden
                            title={t("docs.fallbackNotice")}
                            className="size-1.5 shrink-0 bg-line-strong"
                          />
                        ) : null}
                      </span>
                      <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                        {page.description}
                      </span>
                      {page.readingMinutes ? (
                        <span className="mt-3 font-mono text-[0.6875rem] text-faint">
                          {t("docsIndex.readingTime", {
                            minutes: page.readingMinutes,
                          })}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}