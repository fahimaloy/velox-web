import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { PipelineDiagram } from "@/components/landing/pipeline-diagram";
import { CrateTable } from "@/components/docs/crate-table";
import { DirectiveTable } from "@/components/docs/directive-table";

/**
 * Global MDX component map.
 *
 * The Next 16 docs are explicit that this file "is required to use `@next/mdx`
 * with App Router and will not work without it". It lives at the same level as
 * `app` (inside `src/`, because this project uses a `src` directory), and it
 * must export a function named exactly `useMDXComponents` that takes no
 * arguments.
 *
 * WHAT GOES IN HERE
 * -----------------
 * MDX maps bare HTML tags (`table`, `pre`, `code`, `a`, …) onto these
 * components. Two jobs:
 *
 *   1. Correctness. A raw `<pre>` gets no copy button, no filename header, and
 *      no syntax highlighting. Mapping `pre` → `<CodeBlock>` means every code
 *      fence in every doc gets them for free, without the author remembering.
 *   2. Safety. An author-supplied `href` is passed through `safeHref`, so a
 *      `javascript:` URL in an MDX file cannot become a clickable XSS vector.
 *      MDX is authored in-repo, but the check costs nothing and the failure
 *      mode it prevents is silent.
 *
 * Anything NOT here is styled by `.prose-velox` in globals.css, which is
 * deliberately a hand-tuned scale rather than the `prose` plugin — see the
 * comment in globals.css for why.
 */

/**
 * Reject dangerous URL schemes.
 *
 * Protocol-relative and relative URLs are allowed; `javascript:`, `data:` and
 * `vbscript:` are not. The check is case-insensitive and ignores leading
 * whitespace and control characters, because `\tjavascript:` and
 * `JaVaScRiPt:` are both live bypasses of a naive `startsWith`.
 */
function safeHref(href: string): string | undefined {
  const normalized = href.replace(/[\u0000-\u0020]/g, "").toLowerCase();
  if (
    normalized.startsWith("javascript:") ||
    normalized.startsWith("vbscript:") ||
    normalized.startsWith("data:")
  ) {
    return undefined;
  }
  return href;
}

/** True when a link leaves the site and therefore needs `target`/`rel`. */
function isExternal(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href);
}

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    ...components,
    a: ({ href, children, ...props }) => {
      const safe = href ? safeHref(href) : undefined;
      if (!safe) {
        // Render the text without a link rather than dropping it — a broken
        // doc should not silently lose content.
        return <span>{children}</span>;
      }
      if (isExternal(safe)) {
        return (
          <a
            href={safe}
            target="_blank"
            // `noreferrer` implies `noopener`; both are required, not optional,
            // or the opened page gets a handle on `window.opener`.
            rel="noreferrer noopener"
            {...props}
          >
            {children}
          </a>
        );
      }
      return (
        <a href={safe} {...props}>
          {children}
        </a>
      );
    },
    Callout,
    CodeBlock,
    Pipeline: PipelineDiagram,
    CrateTable,
    DirectiveTable,
  };
}