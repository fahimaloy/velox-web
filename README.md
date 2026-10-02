# velox_web

Marketing and documentation site for [Velox](https://github.com/fahimaloy/velox),
a Rust UI framework.

Static export, three languages, no server runtime.

## Stack

Next.js 16.3.8 (App Router, Turbopack) · TypeScript 5.9 · Tailwind CSS 4 ·
next-intl 4 · Radix UI · lucide-react · MDX · Vitest · Playwright

## Commands

```bash
pnpm install
pnpm dev          # dev server
pnpm check        # typecheck → lint → unit tests → build   (the gate)
pnpm ci           # check + E2E against the exported site
```

`pnpm check` is the command that matters. It must pass before a commit.

## Architecture notes

### Static export, and what that rules out

`output: "export"` writes `out/` as plain files. Three consequences that shape
the code:

- **No `proxy.ts` / `middleware.ts`.** Next 16 does not support Proxy under
  static export, and neither is runtime-free.
- **No locale negotiation.** `Accept-Language` requires a request. So
  `localeDetection: false`, and English is chosen by URL.
- **No `headers()`.** Anything calling it fails the build with
  `couldn't be rendered statically because it used headers()`. This is why
  `NextIntlClientProvider` lives in `app/[locale]/layout.tsx` and not in the
  root layout: the root layout is *above* the segment that knows the locale,
  so `getMessages()` there falls back to reading headers.

### URL layout

| URL | Serves |
|---|---|
| `/en/`, `/bn/`, `/zh/` | Landing page |
| `/<locale>/docs/<page>/` | Documentation |
| `/` and `/docs/` | Redirect to English |

**The root is a redirect, not a page.** `localePrefix: "as-needed"` makes the
unprefixed URL *resolve* to English, but the export still writes only
`out/en/index.html`. `scripts/postbuild.mjs` writes `out/index.html` and
`out/docs/index.html` as redirects using `location.replace` (not `assign`, so
Back does not bounce). This runs automatically as part of `pnpm build`.

That indirection exists because Cloudflare Pages and Netlify can be configured
to rewrite the root, but **GitHub Pages cannot** — a host config would make `/`
work on two of the four supported targets.

### i18n

- Three catalogs: `src/messages/{en,bn,zh}.json`, kept at exact key parity.
- Docs are authored per locale. A page with no translation falls back to
  English **and shows a visible notice** — a silent fallback inside a Bengali
  page reads as a bug in the site.
- All `t()` keys are validated against `en.json` by
  `tests/unit/missing-keys.test.ts`, including keys built from template
  literals.

### Content

`src/lib/velox-facts.ts` is the single source of truth for anything that
changes: crate line counts, test counts, pipeline stages, directive support.
Tables and diagrams render from it so they cannot drift.

Docs pages live in `src/content/<locale>/docs/*.mdx` and are registered
explicitly in `src/lib/docs/registry.ts`. Explicit imports rather than
`import.meta.glob` or `fs.readdir`, because a filesystem scan is not
statically analysable and `generateStaticParams` would have nothing to
enumerate.

### Accuracy policy

Every technical claim is either verified against source, or explicitly marked
as planned. The docs state plainly that `v-model` parses but does nothing, that
`@media` is never evaluated, that `emit()` discards its handler, and that `r`
and `q` kill the app mid-typing. Those are real behaviours in the current
source. A site that omitted them would be worse than no site.

## Testing

| Suite | Protects |
|---|---|
| `i18n.test.ts` | Catalog parity across locales |
| `content.test.ts` | Frontmatter, ordering, prev/next chains |
| `missing-keys.test.ts` | Every `t()` call site resolves |
| `build-output.test.ts` | Exported HTML has no `MISSING_MESSAGE` |
| `e2e/site.spec.ts` | Real browser, real exported files |

`build-output.test.ts` exists because `next build` exits **0** while printing
`MISSING_MESSAGE` to stderr. That failure mode reached production here once.
The test reads `out/`, the artifact the deploy target actually serves.

## Deploying

Build output is `out/`. No runtime, no environment variables required.

- **Cloudflare Pages** — build `pnpm build`, output directory `out`.
  `.github/workflows/deploy.yml` is wired for this.
- **Netlify** — build `pnpm build`, publish `out`.
- **GitHub Pages** — publish `out` to the branch root. The postbuild redirect
  is what makes `/` work here.
- **Any static server** — serve `out` with directory-index resolution.

## Adding a docs page

1. Create `src/content/en/docs/<slug>.mdx` with validated frontmatter.
2. Register it in `EN` in `src/lib/docs/registry.ts`.
3. `pnpm check` — a missing or duplicate `order` fails the tests.