"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/locale";
import { SECTIONS } from "@/lib/docs/types";
import { getNeighbours } from "@/lib/docs/types";
import type { DocPage } from "@/lib/docs/types";

/**
 * The docs shell: sidebar, page header, prev/next.
 *
 * The sidebar is rendered on the server and is fully populated in the static
 * HTML — it is not built on demand from a client-side fetch. On a static site
 * that is the difference between a documentation page that is instantly
 * navigable and one that shows an empty column while a request resolves.
 *
 * The active-item highlight needs `usePathname`, which is a client hook, so
 * this whole shell is a client component even though nothing in it fetches
 * anything. `usePathname` from next-intl returns the locale-stripped path,
 * which is exactly the shape `href` is stored in — so the comparison needs no
 * locale juggling.
 */
export function DocsShell({
  locale,
  pages,
  currentHref,
  title,
  description,
  badge,
  showFallbackNotice,
  sourcePath,
  children,
}: {
  locale: Locale;
  pages: DocPage[];
  currentHref: string;
  title: string;
  description: string;
  badge?: "new" | "planned" | "beta";
  showFallbackNotice?: boolean;
  /** Path of the MDX file backing this page, shown under the content. */
  sourcePath: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("docs");
  const [navOpen, setNavOpen] = useState(false);
  const { previous, next } = getNeighbours(pages, {
    href: currentHref,
    locale,
  } as DocPage);

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <div className="flex gap-10">
        {/* ---------------------------------------------------------------
            Sidebar. `sticky` + its own scroll container, so a long docs
            tree does not make the page taller than the viewport.
            --------------------------------------------------------------- */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav
            aria-label={t("onThisPage")}
            className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto py-10 pe-4"
          >
            <Sidebar pages={pages} currentHref={currentHref} />
          </nav>
        </aside>

        <div className="min-w-0 flex-1 py-10">
          {/* Mobile nav toggle — a disclosure, so it stays in the tab order
              and its links are reachable without a focus trap. */}
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            aria-expanded={navOpen}
            aria-controls="docs-mobile-nav"
            className="mb-6 inline-flex h-9 items-center gap-2 border border-line px-3 text-sm text-muted lg:hidden"
          >
            {navOpen ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
            {t("onThisPage")}
          </button>

          {navOpen ? (
            <nav
              id="docs-mobile-nav"
              className="mb-8 border border-line bg-panel p-4 lg:hidden"
            >
              <Sidebar
                pages={pages}
                currentHref={currentHref}
                onNavigate={() => setNavOpen(false)}
              />
            </nav>
          ) : null}

          <header className="mb-10 border-b border-line pb-8">
            {badge ? <Badge kind={badge} /> : null}
            <h1 className="mt-3 font-display text-[clamp(1.9rem,1.4rem+2.2vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted text-pretty">
              {description}
            </p>
          </header>

          {showFallbackNotice ? <FallbackNotice /> : null}

          {children}

          {/* Shows which file to edit for a content change. */}
          <p className="mt-12 border-t border-line pt-4 font-mono text-[0.6875rem] text-faint">
            {sourcePath}
          </p>

          <PrevNext previous={previous} next={next} />
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  pages,
  currentHref,
  onNavigate,
}: {
  pages: DocPage[];
  currentHref: string;
  onNavigate?: () => void;
}) {
  return <SidebarNav pages={pages} currentHref={currentHref} onNavigate={onNavigate} />;
}

/** Split out so it can be a server component if the active state ever moves. */
function SidebarNav({
  pages,
  currentHref,
  onNavigate,
}: {
  pages: DocPage[];
  currentHref: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-7">
      {SECTIONS.map((section) => {
        const inSection = pages.filter((p) => p.section === section.id);
        if (inSection.length === 0) return null;

        return (
          <li key={section.id}>
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
              {section.label}
            </h2>
            <ul className="mt-3 space-y-0.5">
              {inSection.map((page) => {
                const active = page.href === currentHref;
                return (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2 border-s-2 py-1.5 pe-2 ps-3 text-sm transition-colors",
                        active
                          ? "border-s-accent bg-panel font-medium text-ink"
                          : "border-s-transparent text-muted hover:border-s-line-strong hover:text-ink",
                      )}
                    >
                      <span className="min-w-0 truncate">
                        {page.navTitle ?? page.title}
                      </span>
                      {page.badge === "planned" ? (
                        <span
                          aria-hidden
                          className="size-1 shrink-0 bg-line-strong"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

function Badge({ kind }: { kind: "new" | "planned" | "beta" }) {
  const t = useTranslations("callout");
  const map = {
    new: { label: t("note"), className: "border-ok/40 text-ok" },
    beta: { label: t("warning"), className: "border-warn/45 text-warn" },
    planned: { label: t("planned"), className: "border-line-strong text-faint" },
  } as const;
  const { label, className } = map[kind];

  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em]",
        className,
      )}
    >
      {label}
    </span>
  );
}

function FallbackNotice() {
  const t = useTranslations("docs");
  return (
    <div
      role="status"
      className="mb-8 flex items-start gap-3 border border-dashed border-line-strong px-4 py-3 text-sm text-muted"
    >
      <span aria-hidden className="mt-1.5 block size-1.5 shrink-0 bg-line-strong" />
      <p>{t("fallbackNotice")}</p>
    </div>
  );
}

function PrevNext({ previous, next }: { previous?: DocPage; next?: DocPage }) {
  const t = useTranslations("docs");

  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={previous.href}
          className="group flex flex-col bg-panel p-5 transition-colors hover:bg-sunken"
        >
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
            ← {t("previous")}
          </span>
          <span className="mt-1.5 font-display text-base font-semibold tracking-tight">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden className="hidden bg-panel sm:block" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col bg-panel p-5 text-end transition-colors hover:bg-sunken"
        >
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
            {t("next")} →
          </span>
          <span className="mt-1.5 font-display text-base font-semibold tracking-tight">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}