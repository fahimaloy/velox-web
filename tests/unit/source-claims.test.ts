import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DIRECTIVES } from "@/lib/velox-facts";

/**
 * Documentation claims must be checked against the framework's SOURCE.
 *
 * WHY THIS TEST EXISTS
 * --------------------
 * The site asserted that `v-model` "parses, lints clean, and does nothing".
 * That was false. `velox-sfc/src/codegen.rs` calls
 * `collect_vmodel_expressions` and emits a `__vmodel_set_*` setter into a
 * generated `impl State` block — and a comment there records that this was
 * recently BROKEN (the setters were emitted as free functions, giving E0599) and
 * has since been fixed. The site documented a bug that no longer existed,
 * because the claim was written from an earlier reading and never re-checked.
 *
 * On a marketing site a wrong capability claim is worse than no claim: a reader
 * builds around it and the framework looks broken.
 *
 * WHEN IT RUNS
 * ------------
 * Only when the framework repository is a sibling of this one. In CI for THIS
 * repo the framework is not present, so the suite skips rather than passing
 * vacuously — a skipped suite is honest about not having checked.
 */
const FRAMEWORK = join(process.cwd(), "..", ".git");

const available = existsSync(FRAMEWORK);

/** Read a path from the framework's COMMITTED tree, not the working tree. */
function atHead(path: string): string {
  return execFileSync("git", ["-C", join(process.cwd(), ".."), "show", `HEAD:${path}`], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

describe.skipIf(!available)("framework claims vs. source", () => {
  /**
   * A directive marked `implemented: true` must have its implementation
   * observable in the committed SFC compiler.
   */
  it("every implemented directive appears in the SFC compiler", () => {
    const sources = [
      "velox-sfc/src/codegen.rs",
      "velox-sfc/src/template_codegen.rs",
      "velox-sfc/src/template_ast.rs",
      "velox-sfc/src/grammar.pest",
    ]
      .map(atHead)
      .join("\n");

    for (const d of DIRECTIVES) {
      if (!d.implemented) continue;
      expect(
        sources,
        `"${d.name}" is documented as implemented but "${d.name}" appears nowhere in the SFC compiler`,
      ).toContain(d.name);
    }
  });

  /**
   * The inverse, and the direction that matters: a directive the COMPILER
   * HANDLES must not be documented as unimplemented.
   *
   * This is the check that catches the `v-model` error. A capability that exists
   * in the source but is written up as a limitation is the most damaging kind of
   * documentation bug on a framework site: a reader works around a limitation
   * that was fixed months ago, and concludes the framework is worse than it is.
   */
  it("nothing the compiler handles is documented as unimplemented", () => {
    const codegen = atHead("velox-sfc/src/codegen.rs");
    const templateCodegen = atHead("velox-sfc/src/template_codegen.rs");
    const stripComments = (src: string) =>
      src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");

    const code = stripComments(codegen) + stripComments(templateCodegen);

    for (const d of DIRECTIVES) {
      if (d.implemented) continue;

      // Search for the BARE directive name, not a quoted `"v-if"` literal.
      //
      // Two facts forced this. `grammar.pest` has no directive names at all —
      // directives arrive as ordinary attributes — so the grammar is no help.
      // And `velox-sfc` contains ZERO occurrences of the literal string
      // `"v-model"` (with quotes): it is reached through helper functions
      // instead. A quoted-literal search therefore can never fire for
      // `v-model`, which is exactly why the wrong claim survived — the first
      // version of this test passed with `v-model` deliberately flipped back to
      // `implemented: false`.
      //
      // Comments are stripped first, because Rust source here is
      // comment-heavy about exactly these directives: both `v-slot`
      // occurrences in velox-sfc are comments explaining that named slots are
      // a FUTURE feature. Searching raw text turned that correct documentation
      // into a false "you claimed it's unimplemented but the code mentions it"
      // failure. The claim under test is about CODE, so comments are not
      // evidence either way.
      const handled = code.includes(d.name);

      expect(
        handled,
        `"${d.name}" is documented as NOT implemented, but velox-sfc appears to handle it. Re-read the committed source and update DIRECTIVES in src/lib/velox-facts.ts.`,
      ).toBe(false);
    }
  });

  it("v-model really does generate a setter", () => {
    const codegen = atHead("velox-sfc/src/codegen.rs");
    expect(codegen).toContain("collect_vmodel_expressions");
    expect(codegen).toContain("generate_vmodel_setters");
    expect(codegen).toContain("__vmodel_set_");
  });
});