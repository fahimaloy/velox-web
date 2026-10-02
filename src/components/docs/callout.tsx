import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  CircleAlert,
  Info,
  Lightbulb,
  TriangleAlert,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Callouts for MDX.
 *
 * The visual distinction is semantic, not decorative: `danger` and `warning`
 * are rendered with genuinely different icons AND border colours, so the
 * difference survives both a glance and a monochrome print. Author labels come
 * from the message catalog rather than being written inline in each MDX file,
 * which is what keeps a Bengali doc page reading "সাবধান" rather than
 * "Careful".
 */
const VARIANTS = {
  note: {
    icon: Info,
    // Informational: uses the muted line, no accent.
    className: "border-line-strong bg-panel",
    iconClass: "text-info",
    key: "note",
  },
  tip: {
    icon: Lightbulb,
    className: "border-ok/40 bg-ok/5",
    iconClass: "text-ok",
    key: "tip",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-warn/45 bg-warn/5",
    iconClass: "text-warn",
    key: "warning",
  },
  danger: {
    icon: CircleAlert,
    // The most severe variant: it is the only one that takes the accent, so
    // "this will bite you" is unmistakable at a glance.
    // `bg-accent-soft` rather than a literal `bg-accent/6`: the token is
    // defined in globals.css as a color-mix against transparent, and using
    // the semantic name means the callout tracks the accent if it ever shifts.
    className: "border-accent/50 bg-accent-soft",
    iconClass: "text-accent",
    key: "danger",
  },
  planned: {
    icon: Hammer,
    className: "border-dashed border-line-strong bg-transparent",
    iconClass: "text-faint",
    key: "planned",
  },
} as const;

export type CalloutVariant = keyof typeof VARIANTS;

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutVariant;
  /** Overrides the catalog label for this callout. Rarely needed. */
  title?: string;
  children: ReactNode;
}) {
  const t = useTranslations("callout");
  const variant = VARIANTS[type];
  const Icon = variant.icon;

  return (
    <aside
      // `role="note"` is the ARIA role for an aside with tangential content.
      // It is a landmark-free, non-intrusive announcement: a screen reader
      // user can navigate to it, but it is not a live region and does not
      // interrupt.
      role="note"
      className={cn(
        "my-6 flex gap-3.5 border-s-2 px-4 py-3.5",
        variant.className,
      )}
    >
      <Icon
        className={cn("mt-0.5 size-[1.15rem] shrink-0", variant.iconClass)}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="font-display text-[0.95rem] font-semibold tracking-tight">
          {title ?? t(variant.key)}
        </p>
        <div className="mt-1.5 text-[0.9rem] leading-relaxed text-muted [&>*:first-child]:mt-0 [&>p+p]:mt-2">
          {children}
        </div>
      </div>
    </aside>
  );
}