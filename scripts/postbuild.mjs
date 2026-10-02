import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Post-build: make the site root work on a plain static host.
 *
 * THE PROBLEM
 * -----------
 * `localePrefix: "as-needed"` means English is *served* at both `/en` and `/`,
 * but `output: "export"` still only WRITES `out/en/index.html`. There is no
 * `out/index.html`.
 *
 * So a host that serves `out/` verbatim returns 404 for `/` and `/docs`.
 * Cloudflare Pages and Netlify can be configured to rewrite the root, but
 * GitHub Pages cannot, and an S3 bucket behind a bare static server cannot
 * either. Relying on host configuration would make the root URL work on two
 * of the four documented deploy targets.
 *
 * THE FIX
 * -------
 * Emit a real `out/index.html` (and `out/docs/index.html`) that redirects to
 * the English equivalent, using a meta refresh plus a canonical link and a
 * JavaScript `location.replace`. The `location.replace` matters: it replaces
 * the history entry, so the visitor's Back button does not bounce them through
 * the redirect again.
 *
 * A redirect rather than a copy is deliberate. Copying `en/index.html` to the
 * root would serve English at `/` while every internal link in it resolved
 * against `/en/`, and the site would appear to work while quietly losing the
 * unprefixed URLs that `as-needed` promises.
 */

const OUT = join(process.cwd(), "out");
const DEFAULT_LOCALE = "en";

/**
 * @param {string} target  locale-prefixed destination, e.g. "/en/docs/"
 */
function redirect(target) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Velox</title>
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <meta name="robots" content="noindex" />
    <script>
      // location.replace, not location.assign: this should not create a new
      // history entry, or the visitor's Back button returns them here and they
      // are redirected forward again.
      window.location.replace(${JSON.stringify(target)});
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="${target}">${target}</a>…</p>
  </body>
</html>
`;
}

/** Write the redirect for one locale-less path. */
function emit(relDir, target) {
  const dir = join(OUT, relDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), redirect(target), "utf8");
  console.log(`  out/${relDir ? relDir + "/" : ""}index.html -> ${target}`);
}

if (!existsSync(OUT)) {
  console.error("out/ does not exist — run `pnpm build` first.");
  process.exit(1);
}

// Only emit these when the target actually exists; otherwise a redirect leads
// to a 404, which is worse than a 404 at the root.
if (!existsSync(join(OUT, DEFAULT_LOCALE, "index.html"))) {
  console.error(
    `out/${DEFAULT_LOCALE}/index.html is missing — did generateStaticParams run?`,
  );
  process.exit(1);
}

console.log("Emitting root redirects (locale detection is impossible in static export):");
emit("", `/${DEFAULT_LOCALE}/`);
emit("docs", `/${DEFAULT_LOCALE}/docs/`);

// A 404 that redirects would be a redirect loop; the exported 404 page is
// already correct, so it is only copied when the host lacks one.
if (existsSync(join(OUT, "404.html")) && !existsSync(join(OUT, "404", "index.html"))) {
  mkdirSync(join(OUT, "404"), { recursive: true });
  copyFileSync(join(OUT, "404.html"), join(OUT, "404", "index.html"));
}