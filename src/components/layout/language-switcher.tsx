"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALE_OPTIONS } from "@/i18n/locale";
import { localePath, type Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

/**
 * Language switcher.
 *
 * A native-language list in a dropdown. Each option is labelled with its
 * AUTONYM ("বাংলা", "中文", "English"), never its English name — a Bengali
 * speaker who does not read English still has to be able to find their own
 * language in the list.
 *
 * WHY IT NAVIGATES RATHER THAN SETTING A COOKIE
 * ---------------------------------------------
 * A cookie-based switcher would need to read `cookies()` to know the current
 * locale, and under `output: "export"` there is no request to read a cookie
 * from — a cookie-reading route opts into dynamic rendering and the export
 * fails. Putting the locale in the URL (which next-intl already does) means the
 * locale is a property of the page, not of a session: every locale is a real
 * static HTML file, crawlable and linkable.
 *
 * The current path comes from `usePathname`, so switching from
 * `/bn/docs/cli` to `zh` lands on `/zh/docs/cli`, not on the homepage.
 *
 * `usePathname`, NOT `useParams` — this was a real bug. `useParams()` returns
 * only the DYNAMIC segments of the matched route, so for
 * `/en/docs/introduction/` it returned `{ locale, slug: "introduction" }`:
 * the literal `/docs` segment is a STATIC part of the route and is not a
 * param, so it never appears. Rejoining the params produced `/introduction`,
 * and the Chinese link pointed at `/zh/introduction` — a 404. Reconstructing a
 * URL from params means silently dropping every static segment in the path.
 *
 * `usePathname` from next-intl gives the real pathname with the locale
 * stripped, which is precisely the input `localePath` wants.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("language");
  const active = useLocale() as Locale;
  // next-intl's `usePathname` strips the active locale and keeps every other
  // segment, static or dynamic.
  const pathname = usePathname();

  /** The locale-prefixed URL for `next`, preserving the current route. */
  function hrefFor(next: Locale): string {
    return localePath(next, pathname);
  }

  const current = LOCALE_OPTIONS.find((o) => o.code === active);

  return (
    <div className={cn("relative", className)}>
      <details className="group relative">
        <summary
          className={cn(
            "flex h-9 cursor-pointer list-none items-center gap-1.5 px-2 text-muted",
            "transition-colors hover:bg-panel hover:text-ink",
            "no-marker",
          )}
          aria-label={t("select")}
        >
          <Globe className="size-[1.05rem]" aria-hidden />
          <span className="text-sm font-medium">{current?.autonym ?? active}</span>
          <ChevronDown
            className="size-3.5 transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>

        <div
          className={cn(
            "absolute end-0 z-50 mt-1 min-w-44 border border-line bg-raised p-1",
            "shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)]",
          )}
        >
          <ul role="menu" aria-label={t("label")}>
            {LOCALE_OPTIONS.map((option) => {
              const isActive = option.code === active;
              return (
                <li key={option.code}>
                  {/*
                    An <a href>, NOT a <button onClick>.

                    A button has no href, which means the language switcher is
                    invisible to a crawler, cannot be opened in a new tab, and
                    shows no destination in the status bar. Each locale IS a real
                    static file at a real URL, so the honest element is an
                    anchor.

                    Navigation is still a full page load — not a client-side
                    route change — because each locale ships its own font
                    subsets, `<html lang>` and title. That is the correct
                    behaviour for a static export, and it happens for free by
                    not using a router at all.
                  */}
                  <a
                    href={hrefFor(option.code)}
                    hrefLang={option.tag}
                    aria-current={isActive ? "true" : undefined}
                    onClick={(event) => {
                      // Close the <details> so the menu is not left open if the
                      // navigation is served from the back/forward cache.
                      // `currentTarget` is the anchor; typed as EventTarget by
                      // the generic handler, so narrow it explicitly.
                      const anchor = event.currentTarget;
                      if (anchor instanceof Element) {
                        anchor.closest("details")?.removeAttribute("open");
                      }
                    }}
                    lang={option.tag}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-2.5 py-2 text-start text-sm",
                      "transition-colors hover:bg-panel",
                      isActive ? "text-accent-ink" : "text-ink",
                    )}
                  >
                    {/* The autonym is the visible label; `englishName` goes in
                        the aria-label so a screen reader user who is navigating
                        by voice can still hear which language it is. */}
                    <span aria-label={option.englishName}>{option.autonym}</span>
                    {isActive ? (
                      <Check className="size-3.5 shrink-0" aria-hidden />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </details>
    </div>
  );
}