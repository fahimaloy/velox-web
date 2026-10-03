import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/panel";
import { PipelineDiagram } from "@/components/landing/pipeline-diagram";
import { Showcase } from "@/components/landing/showcase";
import { CommandBlock } from "@/components/landing/command-block";
import {
  CRATES,
  TEST_COUNT,
  EXAMPLES,
  REPO_URL,
} from "@/lib/velox-facts";
import { QUICK_START } from "@/lib/showcase";
import { getLocaleOption } from "@/lib/locale-meta";
import type { Locale } from "@/i18n/locale";

/**
 * Resolve messages at build time.
 *
 * Without this, next-intl would try to read the request and the static export
 * would fail. `setRequestLocale` is the documented way to pin a locale for a
 * prerendered route.
 *
 * NOTE: this page deliberately does NOT export `generateStaticParams`. Under
 * `output: "export"`, Next requires every dynamic route in the segment to
 * contribute at least one param; an empty array fails the build with
 * `returned an empty array from "generateStaticParams()"`. The locale list is
 * declared once, by the parent `[locale]/layout.tsx`, which is where it
 * belongs — duplicating it here would be a second source of truth that could
 * drift.
 */
export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const t = await getTranslations();
  const option = getLocaleOption(locale);
  const totalLoc = CRATES.reduce((sum, c) => sum + c.loc, 0);

  return (
    <>
      <Hero />
      <Stats totalLoc={totalLoc} />
      <Pipeline />
      <Features />
      <Crates />
      <ShowcaseSection />
      <Examples />
      <NonGoals />
      <CallToAction />
    </>
  );

  // ---------------------------------------------------------------- Hero ----

  function Hero() {
    return (
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="rise font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
              {t("hero.eyebrow")}
            </p>

            <h1
              className="rise mt-6 font-display text-[clamp(2.4rem,1.4rem+4.2vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance"
              style={{ ["--i" as string]: 1 }}
            >
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}
              <br />
              <span className="text-accent-ink">{t("hero.titleAccent")}</span>
            </h1>

            <p
              className="rise mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-muted text-pretty"
              style={{ ["--i" as string]: 2 }}
            >
              {t("hero.lede")}
            </p>

            <div
              className="rise mt-9 flex flex-wrap items-center gap-3"
              style={{ ["--i" as string]: 3 }}
            >
              <Button asChild size="lg">
                <Link href="/docs">{t("hero.ctaPrimary")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
                  {t("hero.ctaSecondary")}
                </a>
              </Button>
            </div>

            <div
              className="rise mt-10"
              style={{ ["--i" as string]: 4 }}
            >
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
                {t("install.title")}
              </p>
              <CommandBlock
                command="cargo install velox-cli"
                className="mt-2.5 max-w-md"
              />
            </div>
          </div>

          {/* The pipeline is the hero's second column rather than a background
              flourish, because it is the actual claim being made. */}
          <div
            className="rise self-center"
            style={{ ["--i" as string]: 2 }}
          >
            <PipelineDiagram />
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------- Stats ----

  function Stats({ totalLoc }: { totalLoc: number }) {
    const stats = [
      { value: String(CRATES.length), label: t("hero.statCrates") },
      { value: totalLoc.toLocaleString(option.tag), label: t("hero.statLoc") },
      { value: TEST_COUNT.toLocaleString(option.tag), label: t("hero.statTests") },
      { value: "2", label: t("hero.statBackends") },
    ];

    return (
      <section className="border-b border-line">
        <dl className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="py-8 lg:py-10">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(1.9rem,1.4rem+2vw,2.8rem)] font-semibold leading-none tracking-[-0.03em] tabular">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm text-muted">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  // ------------------------------------------------------------ Pipeline ----

  function Pipeline() {
    return (
      <section id="pipeline" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionHeading
            kicker="01 / pipeline"
            title={t("pipeline.title")}
            description={t("pipeline.description")}
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,44ch)_1fr] lg:gap-16">
            <div className="lg:order-2">
              <PipelineDiagram />
            </div>
            <div className="lg:order-1">
              <p className="border-s-2 border-s-accent ps-5 text-[0.95rem] leading-relaxed text-muted">
                {t("pipeline.note")}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------ Features ----

  function Features() {
    const items = [
      "sfc",
      "reactivity",
      "layout",
      "style",
      "render",
      "events",
      "cli",
      "tooling",
    ] as const;

    return (
      <section id="features" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionHeading
            kicker="02 / capabilities"
            title={t("features.title")}
            description={t("features.description")}
          />

          <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {items.map((key, index) => (
              <article
                key={key}
                className="group relative bg-canvas p-6 transition-colors hover:bg-panel"
              >
                {/* A hairline that grows in from the top on hover — the only
                    "animation" in this grid, so the section stays calm. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                />
                <span className="font-mono text-[0.6875rem] text-faint tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
                  {t(`features.items.${key}.title`)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {t(`features.items.${key}.body`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------- Crates ----

  function Crates() {
    const maxLoc = Math.max(...CRATES.map((c) => c.loc));

    return (
      <section id="crates" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionHeading
            kicker="03 / architecture"
            title={t("crates.title")}
            description={t("crates.description")}
          />

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse">
              <caption className="sr-only">{t("crates.title")}</caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th
                    scope="col"
                    className="p-3 text-start font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint"
                  >
                    {t("crates.columns.crate")}
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-start font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint"
                  >
                    {t("crates.columns.role")}
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-end font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint"
                  >
                    {t("crates.columns.loc")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CRATES.map((crate) => (
                  <tr
                    key={crate.name}
                    className="group border-b border-line transition-colors hover:bg-panel"
                  >
                    <th scope="row" className="p-3 text-start">
                      <code
                        className="font-mono text-sm text-accent-ink"
                        lang="en"
                      >
                        {crate.name}
                      </code>
                    </th>
                    <td className="p-3 text-sm text-ink">
                      <span className="block">{crate.role}</span>
                      <span className="mt-1 block text-muted">
                        {crate.forWhom}
                      </span>
                    </td>
                    <td className="p-3 text-end align-middle">
                      {/* A proportional bar, so the reader sees the shape of the
                          codebase rather than just a column of numbers. */}
                      <span className="flex items-center justify-end gap-3">
                        <span
                          aria-hidden
                          className="hidden h-1 w-24 bg-sunken sm:block"
                        >
                          <span
                            className="block h-full bg-accent"
                            style={{
                              width: `${(crate.loc / maxLoc) * 100}%`,
                            }}
                          />
                        </span>
                        <span className="font-mono text-sm tabular text-muted">
                          {crate.loc.toLocaleString(option.tag)}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm text-faint">{t("crates.locNote")}</p>
          <p className="mt-1.5 text-sm text-faint">{t("crates.footnote")}</p>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------ Showcase ----

  function ShowcaseSection() {
    return (
      <section id="showcase" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionHeading
            kicker="04 / single-file components"
            title={t("showcase.title")}
            description={t("showcase.description")}
          />
          <div className="mt-12">
            <Showcase />
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------ Examples ----

  function Examples() {
    return (
      <section id="examples" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionHeading
            kicker="05 / examples"
            title={t("examples.title")}
            description={t("examples.description")}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {EXAMPLES.map((example) => (
              <article
                key={example.id}
                className="flex flex-col border border-line bg-panel p-6"
              >
                <h3 className="font-mono text-sm font-semibold text-accent-ink">
                  {example.id}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {t(`examples.items.${example.id}.desc`)}
                </p>
                <CommandBlock
                  command={example.command}
                  className="mt-5"
                  label={`${t("examples.run")} ${example.id}`}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------- Non-goals ----

  function NonGoals() {
    const keys = [
      "hotReload",
      "reconciliation",
      "key",
      "media",
      "events",
      "gpu",
    ] as const;

    return (
      <section id="roadmap" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionHeading
            kicker="06 / boundaries"
            title={t("nonGoals.title")}
            description={t("nonGoals.description")}
          />

          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {keys.map((key) => (
              <div key={key} className="border-t border-line pt-5">
                <dt className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                  <span
                    aria-hidden
                    className="inline-block size-1.5 bg-line-strong"
                  />
                  {key}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`nonGoals.items.${key}`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------------- CTA ----

  function CallToAction() {
    return (
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-24">
          <div className="relative overflow-hidden border border-line bg-panel px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-accent/6"
            />
            <div className="relative">
              <h2 className="font-display text-[clamp(1.6rem,1.2rem+1.8vw,2.4rem)] font-semibold tracking-[-0.03em] text-balance">
                {t("cta.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted text-pretty">
                {t("cta.description")}
              </p>

              <div className="mx-auto mt-8 max-w-lg text-start">
                <CommandBlock command={QUICK_START} />
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/docs/quick-start">{t("cta.button")}</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <a
                    href={`${REPO_URL}/issues`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Issues
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}