import {
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  JetBrains_Mono,
  Noto_Sans_Bengali,
  Noto_Sans_SC,
} from "next/font/google";

/**
 * Fonts.
 *
 * Three families, each with a job:
 *
 *   Bricolage Grotesque — display. A variable face with genuine character;
 *     used only for headings and the wordmark. Not the body font, because its
 *     personality is exactly what you do not want at 16px for a whole page.
 *   IBM Plex Sans       — body. Chosen partly for coverage: the superfamily has
 *     Bengali and CJK companions, so the three locales do not each need a
 *     different body face.
 *   JetBrains Mono      — anything measurable: commands, file paths, versions,
 *     counts, and every code block.
 *
 * SUBSETS ARE PER-LOCALE, AND THAT IS THE POINT.
 *
 * `next/font` downloads a font file per subset at build time and self-hosts it.
 * Requesting `bengali` for the English site would ship a Bengali font file to
 * readers who will never see a Bengali glyph — pure weight for no benefit, and
 * on a static site that weight is a real download. Conversely, serving English
 * to a Bengali reader without the Bengali subset means their text falls back to
 * whatever the OS happens to have, which is exactly the "mismatched stranger's
 * face" outcome the design system exists to avoid.
 *
 * So each locale declares the subsets it actually renders, and `latin` is
 * always present because the UI chrome (buttons, nav, code) is Latin in all
 * three locales.
 *
 * The `.variable` option emits a CSS custom property instead of a class name,
 * which is what lets `globals.css` compose the three families per script in one
 * place (`--font-display`, `--font-sans`, `--font-mono`).
 */

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["wdth"],
});

const sansLatin = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans",
});

/**
 * Bengali body text. `subsets: ["bengali"]` is the whole point — see above.
 * Weight must mirror the Latin face or the two will look like different
 * websites stitched together.
 */
const sansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-noto-bengali",
});

/**
 * Simplified Chinese. `Noto Sans SC` is served as many subset files by Google,
 * and next/font unicode-ranges them, so a Chinese page only downloads the
 * slices whose codepoints it actually uses.
 */
const sansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-noto-sc",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

/**
 * The class string applied to `<html>`. Every font is loaded for every locale;
 * what changes per locale is which one `--font-sans` resolves to (see the
 * `:lang()` rules in globals.css).
 *
 * Loading all four sans faces for all locales is deliberate and cheap: only
 * the ones a page's `lang` actually selects are used, and the alternative —
 * conditionally importing font modules per locale — is not expressible in the
 * App Router, where the root layout is shared across every locale. The unused
 * faces are declared with `display: "swap"` and are never referenced by any
 * rendered glyph, so they cost nothing on the critical path.
 */
export const fontVariables = [
  display.variable,
  sansLatin.variable,
  sansBengali.variable,
  sansSC.variable,
  mono.variable,
].join(" ");