/**
 * Framework facts, measured from the Velox source tree.
 *
 * Everything in this file is a NUMBER or a FACT about code that exists, not a
 * plan. It is deliberately kept apart from the message catalogs: these values
 * do not change per locale (they are counts of Rust source, not prose), so
 * translating them would be meaningless — but they DO change as the framework
 * grows, so they live in one audited place rather than being scattered through
 * JSX where they would silently rot.
 *
 * The counts were taken from the repository at the revision documented in
 * docs/CONTENT.md. A test asserts the crate list matches the workspace
 * `Cargo.toml` members, so adding a crate without updating the site is a build
 * failure rather than an omission nobody notices.
 */

export interface CrateInfo {
  /** Cargo package name. */
  name: string;
  /** What this crate is responsible for. */
  role: string;
  /** Approximate lines of Rust in `src/`, for scale only. */
  loc: number;
  /** One-line "you probably want this if…" audience note. */
  forWhom: string;
}

/**
 * Line counts by crate, from `wc -l` over each crate's `src/*.rs`.
 * These move constantly — they are scale indicators, not measurements to cite
 * in a paper. `docs/CONTENT.md` records the revision they were taken at.
 */
export const CRATES: CrateInfo[] = [
  {
    name: "velox-sfc",
    role: "Parses .vx single-file components and generates Rust",
    loc: 12961,
    forWhom: "Anyone writing components. You never call it directly.",
  },
  {
    name: "velox-renderer",
    role: "Skia backends, painting, hit testing, event loop",
    loc: 12090,
    forWhom: "Anyone opening a window or handling input.",
  },
  {
    name: "velox-dom",
    role: "VNode types, the layout engine, style resolution",
    loc: 8997,
    forWhom: "Anyone debugging layout, which is most people, eventually.",
  },
  {
    name: "velox-cli",
    role: "init / build / dev / run / lint / add",
    loc: 3187,
    forWhom: "Everyone. This is the tool you type.",
  },
  {
    name: "velox-core",
    role: "Signals, effects, lifecycle hooks, watchers",
    loc: 2299,
    forWhom: "Anyone holding state.",
  },
  {
    name: "velox-style",
    role: "CSS parsing, selectors, the cascade",
    loc: 1813,
    forWhom: "Anyone writing a stylesheet.",
  },
];

/** Total integration `#[test]` functions across the crates' `tests/` dirs. */
export const TEST_COUNT = 944;

/** Distinct CSS properties the DOM layer recognises. */
export const CSS_PROPERTY_COUNT = 120;

/**
 * Runtime event channels that exist TODAY.
 *
 * This list is short on purpose: the framework wires exactly three attribute
 * reads at runtime. An earlier draft of this site claimed "click, input,
 * change, keyboard, mouse events" — which was aspirational, copied from a
 * framework-agnostic README. Listing three true things beats listing six
 * hopeful ones.
 */
export const SUPPORTED_EVENTS = ["on:click", "on:click-payload", "on:input"] as const;

/** Directives the template compiler handles. */
export const SUPPORTED_DIRECTIVES = [
  { name: "v-if", desc: "Conditional rendering" },
  { name: "v-else-if", desc: "Additional condition" },
  { name: "v-else", desc: "Fallback when no condition holds" },
  { name: "v-for", desc: "Iterate a collection with a destructuring pattern" },
  { name: "v-model", desc: "Two-way binding to a text field" },
  { name: "v-show", desc: "Toggle visibility, keeping the element in the tree" },
] as const;

/** Attribute kinds the parser distinguishes. */
export const ATTR_KINDS = [
  { syntax: 'class="app"', kind: "Static", desc: "A literal string" },
  { syntax: ':value="draft"', kind: "Bind", desc: "Resolved from state each frame" },
  { syntax: '@click="handler"', kind: "On", desc: "An event binding" },
  { syntax: 'v-if="count > 0"', kind: "Directive", desc: "A compiler directive" },
] as const;

export const REPO_URL = "https://github.com/fahimaloy/velox";
export const ISSUES_URL = `${REPO_URL}/issues`;

/** The pipeline stages, in the order one frame walks them. */
export const PIPELINE_STAGES = [
  {
    id: "signal",
    crate: "velox-core",
    what: "State changes; dependent effects are queued.",
  },
  {
    id: "render",
    crate: "velox-sfc",
    what: "The generated render() builds a fresh VNode tree.",
  },
  {
    id: "style",
    crate: "velox-style",
    what: "The stylesheet resolves onto the tree. Last match wins.",
  },
  {
    id: "layout",
    crate: "velox-dom",
    what: "Block and flex layout compute geometry for the viewport.",
  },
  {
    id: "paint",
    crate: "velox-renderer",
    what: "Skia rasterizes into a reused surface, then presents.",
  },
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]["id"];

export const EXAMPLES = [
  {
    id: "counter",
    pkg: "velox-example-counter",
    command: "cargo run -p velox-example-counter",
    desc: "Signals, computed text, v-model, and buttons bound straight to state methods.",
  },
  {
    id: "todo",
    pkg: "velox-example-todo",
    command: "cargo run -p velox-example-todo",
    desc: "Components with props and emits, v-for over a filtered list, and a filter cycle.",
  },
  {
    id: "showcase",
    pkg: "velox-example-showcase",
    command: "cargo run -p velox-example-showcase",
    desc: "A layout gallery: centring, spacing, flex, scrolling and text alignment.",
  },
] as const;

export type ExampleId = (typeof EXAMPLES)[number]["id"];
/**
 * Directives and whether they are actually implemented.
 *
 * `implemented: false` does NOT mean "the parser rejects it" — it means the
 * parser accepts it, the linter stays quiet, and then nothing happens at
 * runtime. That distinction is the single most misleading thing about this
 * framework's surface area, so it is data here rather than prose, and both the
 * landing page and the docs render from this one list.
 */
export const DIRECTIVES = [
  { id: "if", name: "v-if", implemented: true, note: "Conditionally renders the element." },
  { id: "elseIf", name: "v-else-if", implemented: true, note: "Must directly follow a v-if." },
  { id: "else", name: "v-else", implemented: true, note: "Must directly follow v-if / v-else-if." },
  { id: "for", name: "v-for", implemented: true, note: "Clones the element per iteration." },
  { id: "show", name: "v-show", implemented: true, note: "Toggles display; the node stays." },
  {
    id: "model",
    name: "v-model",
    implemented: false,
    note: "Parses and lints clean, then does nothing. Use :value + @input.",
  },
  { id: "slot", name: "v-slot", implemented: false, note: "Not in the grammar at all." },
] as const;

export type DirectiveId = (typeof DIRECTIVES)[number]["id"];
