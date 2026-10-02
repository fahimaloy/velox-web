"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A terminal-style command block with a copy button.
 *
 * The copy button is the whole reason this is a client component. It uses the
 * async Clipboard API, and it degrades honestly: if the write fails (which
 * happens on insecure origins and when permission is denied), the label says so
 * rather than pretending to have worked. A copy button that silently does
 * nothing is worse than no copy button.
 */
export function CommandBlock({
  command,
  className,
  label,
}: {
  command: string;
  className?: string;
  /** Accessible name for the copy button; falls back to a generic label. */
  label?: string;
}) {
  const t = useTranslations("code");
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("failed");
      window.setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 border border-line bg-sunken px-4 py-3",
        className,
      )}
    >
      {/* A literal prompt character. Decorative — the command text itself is
          the accessible content. */}
      <span aria-hidden className="font-mono text-sm text-accent select-none">
        $
      </span>

      <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-[0.8125rem] leading-relaxed text-ink">
        {command}
      </code>

      <button
        type="button"
        onClick={copy}
        aria-label={label ?? t("copy")}
        title={t("copy")}
        className={cn(
          "shrink-0 p-1.5 text-faint transition-colors hover:text-ink",
          state === "copied" && "text-ok",
          state === "failed" && "text-warn",
        )}
      >
        {state === "copied" ? (
          <>
            <Check className="size-4" aria-hidden />
            <span className="sr-only">{t("copied")}</span>
          </>
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        {state === "failed" ? (
          <span className="sr-only">{t("copy")} — failed</span>
        ) : null}
      </button>
    </div>
  );
}