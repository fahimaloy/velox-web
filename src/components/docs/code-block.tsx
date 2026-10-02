"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A syntax-highlighted code block with a filename header and a copy button.
 *
 * HIGHLIGHTING IS DELIBERATELY NOT DONE HERE.
 *
 * The obvious approach is Shiki or Prism at render time. That is wrong for
 * this site on two counts: Shiki is async and heavyweight, which would force
 * every code block on every page into a Suspense boundary; and highlighting at
 * runtime ships a grammar engine to the browser to do work a build could have
 * finished long ago. Here the code is emitted as plain, correctly-labelled,
 * monospaced text with the panel chrome doing the visual work.
 *
 * The consequence is honest and worth stating: code on this site is not
 * colour-tokenised. It is selectable, copyable, and legible, and it looks like
 * a terminal rather than like a screenshot. If tokenisation is added later it
 * belongs in the MDX pipeline at build time, not in this component.
 */
export function CodeBlock({
  code,
  language = "text",
  filename,
  className,
  /** Hide the filename header (for short inline snippets). */
  bare = false,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  bare?: boolean;
}) {
  const t = useTranslations("code");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Nothing to do: the code is selectable text, so a failed clipboard
      // write is an inconvenience rather than a dead end.
      setCopied(false);
    }
  }

  return (
    <figure
      className={cn(
        "group relative overflow-hidden border border-line bg-sunken",
        className,
      )}
    >
      {!bare ? (
        <figcaption className="flex items-center gap-3 border-b border-line px-4 py-2">
          {filename ? (
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
              {filename}
            </span>
          ) : (
            <span className="flex-1" />
          )}
          {/* `lang` on the element, so a screen reader switches voice rather
              than trying to read Rust as prose. */}
          <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-faint">
            {language}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label={t("copy")}
            className="shrink-0 p-1 text-faint transition-colors hover:text-ink"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-ok" aria-hidden />
                <span className="sr-only">{t("copied")}</span>
              </>
            ) : (
              <Copy className="size-3.5" aria-hidden />
            )}
          </button>
        </figcaption>
      ) : null}

      <pre
        lang={language}
        className={cn(
          "overflow-x-auto px-4 py-4 font-mono text-[0.8125rem] leading-relaxed",
          "text-ink",
          bare && "py-3",
        )}
      >
        <code className="block min-w-max bg-transparent p-0 text-[0.8125rem] whitespace-pre text-ink">
          {code}
        </code>
      </pre>
    </figure>
  );
}