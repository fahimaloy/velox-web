import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { REPO_URL } from "@/lib/velox-facts";
import "./globals.css";

/**
 * Root layout.
 *
 * The App Router root layout is shared by EVERY route in the app, including all
 * three locales — it cannot read the `[locale]` segment, because the segment
 * lives below it. So this file does only the things that are genuinely
 * locale-independent:
 *
 *   - `<html>` / `<body>` (Next requires the root layout to own them)
 *   - font variables
 *   - the theme provider (the choice is stored in localStorage, not a cookie,
 *     so it needs no server and adds nothing to consent)
 *   - a `lang`-setting inline script
 *
 * Everything locale-specific — `<html lang>`, metadata, navigation, and all
 * translated text — happens in `app/[locale]/layout.tsx`.
 *
 * The `lang` script deserves an explanation. The correct, crawler-visible
 * `lang` attribute is rendered server-side onto the `[locale]` wrapper, which
 * is what all CSS and assistive tech key off. But `<html lang>` itself stays
 * `en` in the static markup because that attribute cannot be computed here.
 * This four-line synchronous script, which runs before first paint, copies the
 * wrapper's value up to `<html>` so that in-document links and any UA-level
 * hyphenation/line-breaking behaviour follow the real language. It is a
 * progressive enhancement: with JavaScript disabled the page is still fully
 * correct, because the wrapper carries the authoritative value.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://velox-rs.dev"),
  title: { default: "Velox", template: "%s · Velox" },
  description:
    "A modular Rust UI framework: an SFC compiler, a layout engine, a CSS cascade, and a Skia renderer that paint straight to the screen.",
  applicationName: "Velox",
  authors: [{ name: "Fahim Aloy", url: "https://github.com/fahimaloy" }],
  keywords: [
    "rust",
    "ui framework",
    "skia",
    "gui",
    "single file components",
    "immediate mode",
    "velox",
  ],
  openGraph: {
    type: "website",
    siteName: "Velox",
    url: "https://velox-rs.dev",
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `/${locale}`]),
    ),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a09" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // NOTE: `getMessages()` / `getLocale()` are deliberately NOT called here.
  //
  // The root layout sits ABOVE the `[locale]` segment, so `setRequestLocale`
  // has not run yet when this component executes. next-intl resolves a missing
  // request locale by reading the incoming request's headers, and under
  // `output: "export"` there is no request — the build fails with
  //
  //   Route /[locale]/docs/[...slug] with `dynamic = "error"` couldn't be
  //   rendered statically because it used `headers()`.
  //
  // The fix is structural rather than a flag: the intl provider lives in
  // `[locale]/layout.tsx`, below the segment that knows the locale. This
  // layout therefore knows nothing about locales at all, which is also more
  // honest — it really is locale-independent.
  return (
    // `lang="en"` is a placeholder that the inline script below corrects from
    // the `[locale]` wrapper before first paint. See the note at the top.
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <head>
        <script
          // Synchronous and inline: it must run before first paint so the
          // document language is correct for text shaping and hyphenation.
          // `dangerouslySetInnerHTML` is the standard escape hatch here — there
          // is no CSP-friendly way to ship an inline script in App Router.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var w=document.querySelector("[data-locale]");if(w){document.documentElement.lang=w.getAttribute("lang")||"en";}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="grain min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <noscript>
          <div className="border-b border-line bg-panel px-6 py-3 text-center text-sm">
            Velox documentation is fully readable without JavaScript. The theme
            toggle and the language switcher need it; nothing else does.{" "}
            <a className="underline" href={REPO_URL}>
              Source on GitHub
            </a>
          </div>
        </noscript>
      </body>
    </html>
  );
}