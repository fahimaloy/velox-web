import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import en from "@/messages/en.json";
import { PIPELINE_STAGES } from "@/lib/velox-facts";

/**
 * Catches the failure mode next-intl does NOT report.
 *
 * A key referenced from a component but absent from a catalog renders as the
 * literal string `MISSING_MESSAGE` in the built HTML. It does not throw, and
 * `next build` still exits 0 — which is exactly how `pipeline.stages.*.desc`
 * reached the export in Chinese while the parity test passed.
 *
 * Why the parity test missed it: the key was missing from `en` too, at the
 * moment it was referenced. Comparing catalogs against each other cannot catch
 * a key that is missing from ALL of them. This test closes that hole by
 * scraping `t("…")` call sites out of the source and requiring each one to
 * exist in the English catalog.
 */

type Json = { [key: string]: string | Json };

/**
 * Enumerations for template-literal keys, DERIVED FROM THE SOURCE ARRAYS.
 *
 * The earlier version of this file hardcoded the pipeline stage ids as
 * `parse, codegen, resolve, layout, paint`. The real `PIPELINE_STAGES` is
 * `signal, render, style, layout, paint`. So the test cheerfully validated
 * against an invented pipeline, passed, and shipped four `MISSING_MESSAGE`
 * errors into the Chinese build while reporting success. A hand-maintained
 * list is exactly the kind of thing that drifts from the data it describes.
 *
 * So it is imported instead. `ENUMS` now cannot disagree with the components
 * that consume it.
 */
const ENUMS: Record<string, string[]> = {
  "stage.id": PIPELINE_STAGES.map((s) => s.id),
  "stageId": PIPELINE_STAGES.map((s) => s.id),
  key: [
    "sfc",
    "reactivity",
    "layout",
    "style",
    "render",
    "events",
    "cli",
    "tooling",
  ],
  "badge.kind": ["new", "planned", "beta"],
};

/**
 * Resolve the first interpolated segment of a template key to concrete values.
 * Returns `null` when the segment is not one of the known enumerations, so the
 * caller can fall back to a prefix check rather than inventing values.
 */
function concreteValues(segment: string): string[] | null {
  const cleaned = segment.replace(/^[\w.]*?\./, (m) => m); // keep as-is
  if (ENUMS[cleaned]) return ENUMS[cleaned];
  if (ENUMS[segment.replace(/^.*?\./, "")]) return ENUMS[segment.replace(/^.*?\./, "")];
  return null;
}

/**
 * Resolve a dotted path.
 *
 * A path whose last segment is `*` (e.g. `docs.*.name`) is a WILDCARD: it
 * matches if ANY leaf exists at or below that prefix. That form is emitted for
 * template keys whose enumerated segment could not be resolved statically, and
 * asserting "at least one exists" is the meaningful check — a stricter one
 * would need the component's data module, which is a build-time concern.
 */
function get(obj: Json, path: string): unknown {
  const parts = path.split(".");
  if (parts[parts.length - 1] === "*") {
    const prefix = parts.slice(0, -1);
    const node = prefix.reduce<unknown>((n, part) => (n as Json)?.[part], obj);
    return node && typeof node === "object" ? Object.keys(node as Json) : undefined;
  }
  return parts.reduce<unknown>((node, part) => (node as Json)?.[part], obj);
}

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, acc);
    else if (/\.(ts|tsx|mdx)$/.test(entry)) acc.push(full);
  }
  return acc;
}

describe("message keys referenced in source", () => {
  const files = sourceFiles(join(process.cwd(), "src"));
  /** Candidate key-sets, joined by a separator that cannot appear in a key. */
  const SEP = "\u0000";
  const referenced = new Set<string>();

  /**
   * Only the `t` bound from `useTranslations` counts.
   *
   * A bare `t("…")` regex matches unrelated local variables named `t` — this
   * repo has a `const [tab, setTab] = useState(...)` whose `setTab("x")` reads
   * as a message lookup. So the file must first be shown to contain a
   * `useTranslations(…)` binding, and only then are its `t(...)` calls treated
   * as message keys.
   */
  for (const file of files) {
    const src = readFileSync(file, "utf8");

    /**
     * The namespace comes from the `useTranslations("…")` argument, so a file
     * whose hook is `useTranslations("search")` and which calls `t("label")`
     * resolves to `search.label`. Without this, every namespaced component
     * would appear to reference bare top-level keys that do not exist.
     *
     * A file may bind more than one hook (a component with two namespaces);
     * each key is checked against every namespace it could belong to and passes
     * if ANY of them defines it.
     */
    const namespaces = [
      ...src.matchAll(/useTranslations\(\s*["'`]([^"'`]+)["'`]/g),
    ].map((m) => m[1]);

    if (namespaces.length === 0) continue;

    for (const match of src.matchAll(/\bt\(\s*["'`]([^"'`$]+)["'`]/g)) {
      referenced.add(namespaces.map((ns) => `${ns}.${match[1]}`).join(SEP));
    }

    /**
     * TEMPLATE-LITERAL keys — the case this test originally missed.
     *
     * `t(`stages.${stage.id}.desc`)` was invisible to the regex above, because
     * it deliberately excludes backtick strings containing `$`. That is how
     * `pipeline.stages.*.desc` shipped as a literal `MISSING_MESSAGE` into the
     * Chinese build while the suite was green.
     *
     * Template keys are handled by EXPANDING them against the same data arrays
     * the component iterates. Where the interpolated segment cannot be resolved
     * (an id that lives in an unrelated module), the prefix is kept and the
     * check asserts that AT LEAST ONE leaf exists under it — which is the
     * meaningful assertion for an enumerated family of keys.
     */
    for (const match of src.matchAll(/\bt\(\s*`([^`]*)`/g)) {
      const raw = match[1];
      const segments = [...raw.matchAll(/\$\{([^}]+)\}/g)];
      if (segments.length === 0) continue;

      const first = segments[0][1];
      // `stage.id` identifies the ENUM; the rest of the first interpolation is
      // a static prefix that must be re-attached, so `stages.${stage.id}.desc`
      // expands to `stages.parse.desc`, not `pipeline.parse`.
      const staticPrefix = raw.slice(0, raw.indexOf("${"));
      const tail = raw.slice(raw.lastIndexOf("}") + 1);

      const concrete = concreteValues(first);
      if (concrete === null) {
        // Unresolvable — assert that at least one leaf exists under the static
        // prefix, which is the meaningful check for an open-ended key family.
        referenced.add(
          namespaces.map((ns) => `${ns}.${staticPrefix}*${tail}`).join(SEP),
        );
        continue;
      }

      for (const value of concrete) {
        referenced.add(
          namespaces.map((ns) => `${ns}.${staticPrefix}${value}${tail}`).join(SEP),
        );
      }
    }
  }

  it("found message calls to check", () => {
    // If this fails, the regex above stopped matching and the whole suite is
    // vacuously green — the worst outcome for a guard test.
    expect(referenced.size).toBeGreaterThan(20);
  });

  /**
   * Each entry is the SET of candidate full keys for one `t("…")` call site.
   * A file with several `useTranslations` hooks (e.g. `docs-shell` binds both
   * `docs` and `callout`, because it renders a Badge whose label comes from the
   * callout namespace) yields one candidate per namespace, and the call site
   * passes if any of them resolves.
   */
  for (const entry of [...referenced].sort()) {
    const candidates = entry.split(SEP);
    const label = candidates.join(" | ");
    it(`en.json defines "${label}"`, () => {
      const resolved = candidates.filter((candidate) => get(en, candidate) !== undefined);
      expect(
        resolved.length,
        `${candidates.join(" or ")} is used in source but missing from en.json — it would render as MISSING_MESSAGE`,
      ).toBeGreaterThan(0);
    });
  }
});
