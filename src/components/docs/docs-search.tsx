"use client";

import { useTranslations } from "next-intl";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Search, X } from "lucide-react";
import type { DocPage } from "@/lib/docs/types";
import { cn } from "@/lib/utils";

/**
 * Docs search.
 *
 * WHY THERE IS NO SEARCH INDEX FILE
 * ---------------------------------
 * The obvious design for a static docs site is a prebuilt index — a JSON blob
 * of every heading and paragraph, fetched on first keystroke. This site does
 * not do that, for three reasons:
 *
 *   1. It would need a build step that walks MDX and extracts body text, which
 *      duplicates the content registry rather than reading it.
 *   2. The corpus is ~22 pages. A naive substring scan over their titles and
 *      descriptions is instantaneous — a generated index would be smaller in
 *      latency terms only by adding a network round trip.
 *   3. A fetched index cannot work without JavaScript. This one can: the list
 *      below is in the static HTML, and the input only filters it.
 *
 * The trade-off is real and worth stating plainly: this searches titles and
 * descriptions, not body text. Searching for a phrase that appears only inside
 * a code sample will find nothing. A future section-level index is the right
 * answer if that becomes a problem.
 */
export function DocsSearch({
  pages,
}: {
  /**
   * `locale` was accepted and then never used: the router from next-intl's
   * navigation wrapper already carries the active locale, so passing it in
   * would have been a second source of truth for something the router owns.
   * It is gone rather than renamed `_locale`.
   */
  pages: DocPage[];
}) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * `useDeferredValue` keeps typing responsive. Without it, each keystroke
   * re-filters and re-renders the whole result list synchronously, which is
   * visible as input lag once the list is more than a few dozen rows.
   */
  const deferred = useDeferredValue(query);

  const results = useMemo(() => {
    const needle = deferred.trim().toLowerCase();
    if (needle.length === 0) return [];

    // Rank: a title prefix beats a title substring, which beats a description
    // match. A flat relevance score keeps the obvious answer first without
    // needing a real ranking implementation for 22 documents.
    const scored = pages
      .map((page) => {
        const title = page.title.toLowerCase();
        const description = page.description.toLowerCase();
        const href = page.href.toLowerCase();

        let score = 0;
        if (title.startsWith(needle)) score += 100;
        else if (title.includes(needle)) score += 50;
        if (href.includes(needle)) score += 20;
        if (description.includes(needle)) score += 10;

        return { page, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));

    return scored.slice(0, 12).map((entry) => entry.page);
  }, [deferred, pages]);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <label htmlFor="docs-search" className="sr-only">
          {t("label")}
        </label>

        <Search
          aria-hidden
          className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-faint"
        />

        <input
          id="docs-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            // Enter opens the top result. This is the one keyboard shortcut
            // worth having: it turns the box into a one-keystroke jump.
            if (event.key === "Enter" && results[0]) {
              event.preventDefault();
              router.push(results[0].href);
            }
            if (event.key === "Escape") {
              setQuery("");
              inputRef.current?.blur();
            }
          }}
          placeholder={t("placeholder")}
          autoComplete="off"
          spellCheck={false}
          className="h-12 w-full border border-line bg-sunken ps-11 pe-11 text-[0.95rem] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
        />

        {hasQuery ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label={t("clear")}
            className="absolute end-3 top-1/2 -translate-y-1/2 p-1.5 text-faint hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {/* `aria-live="polite"` so a screen reader announces the result count as
          the user types, without interrupting what they are saying. */}
      <p aria-live="polite" className="sr-only">
        {hasQuery ? t("results", { count: results.length }) : ""}
      </p>

      {hasQuery ? (
        results.length > 0 ? (
          <ul className="mt-3 divide-y divide-line border border-line">
            {results.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  className="group flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-panel"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-sm font-semibold tracking-tight">
                      {page.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {page.description}
                    </span>
                  </span>
                  <code
                    className="shrink-0 font-mono text-[0.6875rem] text-faint"
                    lang="en"
                  >
                    {page.href}
                  </code>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={cn("mt-3 border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted")}>
            {t("empty")}
          </p>
        )
      ) : null}
    </div>
  );
}