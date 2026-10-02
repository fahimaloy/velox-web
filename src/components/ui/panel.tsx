import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A surface.
 *
 * Near-square corners on purpose: this is an instrument chassis, not a card
 * in a SaaS dashboard. `inset` draws the accent hairline on the leading edge
 * instead of a full border — used to mark the "current" pipeline stage.
 */
export function Panel({
  className,
  inset = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "relative border border-line bg-panel",
        inset && "border-s-2 border-s-accent",
        className,
      )}
      {...props}
    />
  );
}

/** A section heading with the tick strip that marks each landing section. */
export function SectionHeading({
  kicker,
  title,
  description,
  id,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {kicker ? (
        <div className="mb-5 flex items-center gap-3">
          <span
            aria-hidden
            className="ticks w-10 shrink-0 self-center"
          />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-accent-ink">
            {kicker}
          </span>
        </div>
      ) : null}
      <h2
        id={id}
        className="font-display text-[clamp(1.75rem,1.2rem+2vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[0.975rem] leading-relaxed text-muted text-pretty">
          {description}
        </p>
      ) : null}
    </header>
  );
}

/** A small mono label — the site's equivalent of an instrument legend. */
export function Legend({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}