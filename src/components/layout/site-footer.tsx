import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { REPO_URL } from "@/lib/velox-facts";
import { Wordmark } from "./wordmark";

export function SiteFooter({ locale }: { locale: string }) {
  const t = useTranslations("footer");

  const columns = [
    {
      title: t("docs"),
      links: [
        { href: "/docs", label: "Introduction" },
        { href: "/docs/installation", label: "Installation" },
        { href: "/docs/quick-start", label: "Quick start" },
        { href: "/docs/cli", label: "CLI reference" },
      ],
    },
    {
      title: t("crates"),
      links: [
        { href: "/docs/architecture", label: "Architecture" },
        { href: "/docs/renderer", label: "Renderer" },
        { href: "/docs/styling", label: "Styling & layout" },
        { href: "/docs/roadmap", label: "Roadmap" },
      ],
    },
  ] as const;

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {t("tagline")}
            </p>
            <p className="mt-4 font-mono text-xs text-faint">
              {t("builtWith")} · {t("license")}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-accent-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label={t("project")}>
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
              {t("project")}
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted transition-colors hover:text-accent-ink"
                >
                  {t("source")}
                </a>
              </li>
              <li>
                <a
                  href={`${REPO_URL}/issues`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted transition-colors hover:text-accent-ink"
                >
                  Issues
                </a>
              </li>
              <li>
                <a
                  href={`${REPO_URL}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted transition-colors hover:text-accent-ink"
                >
                  MIT
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-faint">
            © {new Date().getFullYear()} Fahim Aloy · MIT
          </p>
          <p className="font-mono text-xs text-faint">
            locale: <span className="text-muted">{locale}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}