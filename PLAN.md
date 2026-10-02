# velox_web — implementation plan

Status: **in progress**
Repository: `github.com/fahimaloy/velox-web` (not yet created)
Location: `velox/velox_web/` (git-ignored from the parent repo)

## Goals

A marketing and documentation site for the Velox Rust UI framework that is:

1. **Accurate** — every technical claim verified against source at the
   committed `HEAD`, not copied from a README that overclaims.
2. **Fully static** — `output: "export"`, deployable to GitHub Pages,
   Cloudflare Pages, Netlify or S3 with no Node/Edge runtime.
3. **Multilingual from day one** — English, Bengali, Simplified Chinese.
4. **Fully translated** — no user-visible string outside the catalogs.
5. **Accessible** — works with JavaScript disabled except for three controls.

## Non-negotiable constraints

- Another OpenCode CLI process is actively executing
  `docs/plans/2026-10-02-premium-boilerplate-core-components.md` in the parent
  repo. Uncommitted changes there are **ignored**; research reads committed
  `HEAD` via `git show HEAD:<path>`.
- The parent repo is modified only by the `/velox_web/` gitignore entry.

## Stack

| Choice | Version | Why |
|---|---|---|
| Next.js (App Router) | 16.3.8 | Current stable; Turbopack default |
| TypeScript | 5.9.3 | Deliberately not TS 7 (native port, immature) |
| Tailwind CSS | 4 | Token-first, matches the design system |
| next-intl | 4 | Static-export capable, typed messages |
| Radix UI | primitives | Accessible behaviour, unstyled |
| lucide-react | — | Icon set, ISC-licensed, free |
| Zod | 4 | Frontmatter and config validation |
| Vitest | 5 | Fast unit tests, native TS |
| Playwright | — | E2E against the *exported* site |
| MDX | — | Docs authored as content, not as React components |

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # root: html/body, fonts, theme. NO locale.
│   └── [locale]/
│       ├── layout.tsx          # setRequestLocale + intl provider
│       ├── page.tsx            # landing
│       ├── not-found.tsx
│       └── docs/
│           ├── page.tsx        # index + search
│           └── [...slug]/      # MDX pages
├── i18n/                       # routing, request, navigation, locale
├── messages/                   # en.json, bn.json, zh.json
├── content/<locale>/docs/*.mdx # per-locale docs
├── components/
│   ├── ui/                     # button, panel, tabs
│   ├── docs/                   # callout, code-block, shell, search, tables
│   ├── landing/                # hero pieces, pipeline, showcase
│   └── layout/                 # header, footer, theme, language, wordmark
├── lib/
│   ├── velox-facts.ts          # measured facts — single source of truth
│   ├── docs/                   # schema, registry, sorting, grouping
│   └── …
└── mdx-components.tsx          # required by @next/mdx with App Router
```

### i18n decisions

- `localePrefix: "as-needed"`, `localeDetection: false`. `Accept-Language`
  negotiation cannot work under static export, so it is disabled rather than
  silently broken.
- English unprefixed (`/`), Bengali `/bn`, Chinese `/zh`.
- No `proxy.ts` / `middleware.ts`: Next 16 **does not support Proxy under
  static export**, and neither is a runtime-free mechanism.
- `NextIntlClientProvider` lives in `[locale]/layout.tsx`, **not** the root
  layout. In the root it runs above the segment that knows the locale, so
  `getMessages()` falls back to reading `headers()` and the build fails.
- Docs fall back to English per page, with a **visible notice**. Translation
  coverage is shown on the docs index.

### Content decisions

- Explicit imports in `registry.ts`, not `import.meta.glob` or `fs.readdir` —
  a filesystem scan is not statically analysable, so Next cannot enumerate
  routes and `generateStaticParams` breaks.
- Frontmatter validated by Zod; invalid frontmatter fails the build.
- Prev/next computed from the same sorted list the sidebar renders, so the two
  cannot disagree.
- `velox-facts.ts` holds every rapidly-aging number so it has one home.

## Verification gates

`pnpm check` = typecheck → lint → unit tests → build. `pnpm ci` adds E2E.

Three lessons are encoded as tests rather than as advice:

1. **Catalog parity** — bn/zh must match en exactly. next-intl renders a
   missing key as `MISSING_MESSAGE` in production rather than throwing.
2. **Referenced-key check** — scrapes `t("…")` call sites (including template
   literals) and asserts each resolves. Comparing catalogs to each other
   cannot catch a key missing from *all* of them.
3. **Content integrity** — frontmatter, no duplicate `order`, prev/next chains
   into a complete walk.

E2E runs against `out/` served statically, not `next dev` — a dev server
tolerates request-time behaviour a static host cannot serve.

## Done

- [x] Research: 6 crates, 3 examples, 944 tests, measured LOC
- [x] Static-export config verified against bundled Next 16 docs
- [x] i18n: 3 locales, 171 keys, exact parity
- [x] Design system: instrument-panel tokens, light/dark
- [x] Landing page: hero, stats, pipeline, features, crates, showcase,
      examples, non-goals, CTA
- [x] Docs engine: Zod frontmatter, registry, sidebar, prev/next, search
- [x] Content: 13 English pages, 5 Bengali, 4 Chinese
- [x] Unit tests (100), Vitest config, `next-intl/server` stub
- [x] Playwright config + E2E specs
- [x] CI + Cloudflare Pages deploy workflows
- [x] ESLint clean, `tsc` clean, build produces 48 static pages

## Remaining

- [ ] Run Playwright E2E against the exported site
- [ ] `git init` in `velox_web/` (an earlier scaffold deleted it)
- [ ] Create the public GitHub repo and push
- [ ] Restore `docs/PLAN.md` (deleted by the same scaffold; this file replaces it)
- [ ] Translate the remaining 8 English pages to bn/zh
- [ ] README for the site repo

## Content accuracy rules

Every claim on this site must be one of:

- **Verified** — read from source at committed `HEAD`.
- **Marked planned** — stated as intended, with a link to the roadmap page.

Specifically documented as *not* working, because a reader will otherwise
assume otherwise: `v-model` (parses, lints clean, inert), `@media` (never
evaluated — applies in both modes), `var()`/custom properties (inert), `emit()`
(compiles, discards the handler), function props (impossible), named slots
(absent), `:key` (emitted, unhonoured), `on:keydown`/Esc/F2 (no path to user
code), `r`/`q` keys during typing (kill the app), `+`/`~` combinators (parse as
a tag name, never match).