/**
 * The design system.
 *
 * Direction: "the instrument panel". Velox is a CPU rasterizer that writes
 * pixels into a Skia surface — not a DOM. The site is built to look like a
 * calibrated measuring instrument rather than a SaaS template: near-black
 * chassis, one hot ember accent, monospace for anything measurable, and a lot
 * of deliberate empty space so the typography carries the page.
 *
 * Colour is defined ONCE here as raw channel triplets under `.dark`/light,
 * and `globals.css` composes the oklch `--color-*` tokens on top. That split
 * is deliberate: raw hex has to be authored somewhere for a human to read and
 * diff it, and oklch is what actually gets consumed, because it is the only
 * way to guarantee a contrast ratio holds when a hue rotates between themes.
 */

import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Tells next-intl where the request configuration lives.
 *
 * This plugin is REQUIRED in next-intl v4 — without it the build fails with
 * "Couldn't find next-intl config file", because the plugin is what wires
 * `./src/i18n/request.ts` into the compiler. It also runs a validation step
 * that catches broken message imports at build time rather than letting a page
 * render `MISSING_MESSAGE` at runtime.
 *
 * The path is relative to the project root, and it is resolved relative to the
 * FILE that exports it, so this file and `src/i18n/request.ts` are at a fixed
 * known distance.
 */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * velox_web is a fully static site: `output: "export"` emits plain HTML + JS
 * with no server runtime, so it can be hosted on GitHub Pages, Cloudflare
 * Pages, Netlify or a plain S3 bucket.
 *
 * Two consequences constrain the whole codebase:
 *
 *  1. Nothing may read `headers()`, `cookies()` or `searchParams` in a page
 *     body. Each opts that route into dynamic rendering and `next build`
 *     fails the export. The language switcher therefore navigates by URL
 *     rather than inspecting the current request.
 *  2. `trailingSlash: true` is required — static hosts resolve `/en/docs/cli`
 *     by looking for `/en/docs/cli/index.html`, not for a file named `cli`.
 */
/**
 * Plugins are referenced by STRING, not by imported function.
 *
 * Next 16 ships Turbopack as the default bundler, and the documented constraint
 * is: "remark and rehype plugins without serializable options cannot be used yet
 * with Turbopack, because JavaScript functions can't be passed to Rust." Passing
 * the imported function would work under webpack and fail under Turbopack, so
 * the string form is the one that is correct for this Next version.
 */
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        { behavior: "wrap", properties: { className: ["heading-anchor"] } },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    // `next/image` wants a server to optimize; a static export ships raw files.
    unoptimized: true,
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

/**
 * Plugin order matters: `withNextIntl` wraps the MDX config, not the other way
 * round. The i18n plugin has to see the final `pageExtensions` list in order to
 * treat `.mdx` routes as locale-aware pages.
 */
export default withNextIntl(withMDX(nextConfig));