"use client";

import { useLocale, useTranslations } from "next-intl";
import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/velox-facts";
import { cn } from "@/lib/utils";

/**
 * The frame pipeline, interactive.
 *
 * This is the hero's centrepiece because it IS the product story: Velox has no
 * reconciler and no retained tree, so the honest way to explain it is to show
 * the five passes that actually run, in order, on every frame — and that there
 * is no sixth.
 *
 * It is a client component purely for the hover/focus state; the stage list
 * itself is static data from `velox-facts.ts`, so nothing here is fetched.
 *
 * The animation is a sweep highlight that advances through the stages on its
 * own. It is decorative, not load-bearing: the same information is in the
 * static markup as a labelled ordered list, so with JavaScript disabled the
 * section still reads correctly. `prefers-reduced-motion` stops the sweep via
 * the global CSS rule.
 */
export function PipelineDiagram() {
  const t = useTranslations("pipeline");
  const locale = useLocale();

  return (
    <div className="relative">
      {/* The sweep is a single absolutely-positioned band that travels the
          width of the stage column. It is one element rather than five
          animating ones, so the compositor does one transform, not five. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -z-10 w-1/4 bg-accent/8 sweep"
      />

      <ol className="relative flex flex-col gap-px" lang="en">
        {PIPELINE_STAGES.map((stage, index) => {
          const step = t(`stages.${stage.id}.name`);
          return (
            <li key={stage.id}>
              <StageRow
                index={index}
                stageId={stage.id}
                crate={stage.crate}
                name={step}
                what={t(`stages.${stage.id}.desc`)}
                /** The crate name is a Rust identifier, so it is never
                    translated — it must stay exactly as it appears in Cargo.toml. */
                ariaLabel={`${index + 1}. ${step}, ${stage.crate}`}
                locale={locale}
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-6 border-s-2 border-s-line-strong ps-4 text-sm leading-relaxed text-muted">
        {t("note")}
      </p>
    </div>
  );
}

function StageRow({
  index,
  crate,
  name,
  what,
  ariaLabel,
}: {
  index: number;
  stageId: PipelineStageId;
  crate: string;
  name: string;
  what: string;
  ariaLabel: string;
  locale: string;
}) {
  return (
    <div
      className={cn(
        "group grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1",
        "border-t border-line py-4 transition-colors",
        "hover:bg-panel",
      )}
    >
      <span
        aria-hidden
        className="font-mono text-xs tabular text-faint transition-colors group-hover:text-accent"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-base font-semibold tracking-tight">
            {name}
          </span>
          {/* Rust identifier: kept in English/mono in every locale, because
              translating a crate name would make it un-findable in the source. */}
          <code className="font-mono text-xs text-accent-ink" lang="en">
            {crate}
          </code>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted">{what}</p>
      </div>

      {/* Screen readers get one coherent label per row instead of reading the
          number, the name and the crate as three disconnected fragments. */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}