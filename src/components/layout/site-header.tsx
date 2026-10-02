"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Wordmark } from "./wordmark";

/**
 * Site header.
 *
 * A client component because of the mobile disclosure panel. Everything it
 * renders is translated via `useTranslations`, and all internal links go
 * through next-intl's `Link` so they carry the active locale segment.
 */
export function SiteHeader() {
  // No `locale` prop: every link in here goes through next-intl's `Link`, so
  // the active locale prefix is added by the navigation wrapper. Accepting a
  // locale and never using it would wrongly suggest the header branches on it.

  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/docs", label: t("docs") },
    { href: "/docs#examples", label: t("examples") },
    { href: "/docs/architecture", label: t("crates") },
    { href: "/docs/roadmap", label: t("roadmap") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label="Velox"
        >
          <Wordmark />
        </Link>

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "inline-block px-3 py-2 text-sm text-muted",
                    "transition-colors hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />

          <a
            href="https://github.com/fahimaloy/velox"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              "hidden h-9 items-center gap-2 px-3 text-sm text-muted sm:inline-flex",
              "transition-colors hover:bg-panel hover:text-ink",
            )}
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4 fill-current"
              aria-hidden
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span className="hidden lg:inline">{t("github")}</span>
            <span className="sr-only lg:hidden">{t("github")}</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="inline-flex size-9 items-center justify-center text-muted transition-colors hover:bg-panel hover:text-ink md:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Disclosure rather than a dialog: this is a list of links, and a
          disclosure keeps it in the accessibility tree and the tab order
          without trapping focus. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-canvas md:hidden"
      >
        <nav aria-label={t("primary")} className="px-5 py-3">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 text-[0.95rem] text-muted last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}