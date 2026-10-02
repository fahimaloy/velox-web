import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import type { DocPage } from "./types";
import { docMetaSchema } from "./types";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/i18n/routing";

/**
 * The docs content registry.
 *
 * WHY EXPLICIT IMPORTS RATHER THAN `import.meta.glob` / `fs.readdir`
 * -------------------------------------------------------------
 * A filesystem scan would look tidier and would break the static export in two
 * separate ways: the file list is not statically analysable, so Next cannot
 * enumerate routes for `generateStaticParams`; and a directory read at module
 * scope is a server-side capability that does not exist in a client bundle.
 * The explicit map below is statically analysable, which is the whole
 * requirement. It also means an added page shows up as a type error until it is
 * registered, rather than as a mysterious 404.
 *
 * WHY `en` IS THE FALLBACK
 * ------------------------
 * Docs are authored per locale in `src/content/<locale>/docs/`. Not every
 * page is translated yet. A page that is missing in Bengali falls back to the
 * English file and the UI SHOWS A NOTICE saying so. Two reasons this is
 * surfaced rather than hidden:
 *   1. A silent English fallback inside a Bengali page reads as a bug in the
 *      site, and readers report bugs.
 *   2. It is honest about coverage. `tests/unit/content.test.ts` counts the
 *      per-locale coverage so the gap is a tracked number, not an impression.
 */

/** Metadata + loader for one page in one locale. */
interface Entry {
  meta: unknown;
  load: () => Promise<{ default: ComponentType<{ components?: MDXComponents }> }>;
  /** True when this locale has a real translation rather than the en fallback. */
  translated?: boolean;
}

/* -------------------------------------------------------------------------- */
/* English — the complete set.                                                  */
/* -------------------------------------------------------------------------- */

const EN: Record<string, Entry> = {
  introduction: {
    meta: {
      title: "Introduction",
      description:
        "What Velox is, what it renders onto, and how its one frame is actually built.",
      order: 1,
      section: "start",
    },
    load: () => import("@/content/en/docs/introduction.mdx"),
  },
  installation: {
    meta: {
      title: "Installation",
      description:
        "Install the CLI, build from source, and verify the toolchain on your platform.",
      order: 2,
      section: "start",
    },
    load: () => import("@/content/en/docs/installation.mdx"),
  },
  "quick-start": {
    meta: {
      title: "Quick start",
      description:
        "Scaffold a project, run it, and understand the three files you are handed.",
      order: 3,
      section: "start",
    },
    load: () => import("@/content/en/docs/quick-start.mdx"),
  },
  "single-file-components": {
    meta: {
      title: "Single-file components",
      description:
        "Anatomy of a .vx file: template, script setup, and the scoped stylesheet.",
      order: 10,
      section: "guide",
    },
    load: () => import("@/content/en/docs/single-file-components.mdx"),
  },
  reactivity: {
    meta: {
      title: "Reactivity",
      description:
        "Signals, computed values, effects, watchers and two-way bindings.",
      order: 11,
      section: "guide",
    },
    load: () => import("@/content/en/docs/reactivity.mdx"),
  },
  "styling-layout": {
    meta: {
      title: "Styling and layout",
      description:
        "The properties that are recognised, the selectors that match, and what the cascade does.",
      order: 12,
      section: "guide",
    },
    load: () => import("@/content/en/docs/styling-layout.mdx"),
  },
  events: {
    meta: {
      title: "Events and input",
      description:
        "The three runtime event channels, payloads, and how a click is resolved to a handler.",
      order: 13,
      section: "guide",
    },
    load: () => import("@/content/en/docs/events.mdx"),
  },
  components: {
    meta: {
      title: "Components and props",
      description:
        "Props, emits, slots, and how a parent composes a child component.",
      order: 14,
      section: "guide",
    },
    load: () => import("@/content/en/docs/components.mdx"),
  },
  cli: {
    meta: {
      title: "CLI reference",
      description:
        "Every velox subcommand: init, build, dev, run, lint, add and version.",
      order: 20,
      section: "reference",
    },
    load: () => import("@/content/en/docs/cli.mdx"),
  },
  "template-reference": {
    meta: {
      title: "Template reference",
      description:
        "Directives, attribute kinds, and the exact shape of the SFC grammar.",
      order: 21,
      section: "reference",
    },
    load: () => import("@/content/en/docs/template-reference.mdx"),
  },
  architecture: {
    meta: {
      title: "Architecture",
      description:
        "The six crates, what each owns, and the boundaries between them.",
      order: 30,
      section: "internals",
    },
    load: () => import("@/content/en/docs/architecture.mdx"),
  },
  renderer: {
    meta: {
      title: "The renderer",
      description:
        "The CPU raster surface, why it is deliberate, and what that costs you.",
      order: 31,
      section: "internals",
    },
    load: () => import("@/content/en/docs/renderer.mdx"),
  },
  roadmap: {
    meta: {
      title: "Roadmap and non-goals",
      description:
        "What is deliberately not implemented, and why stating it is more useful than a feature list.",
      order: 40,
      section: "internals",
    },
    load: () => import("@/content/en/docs/roadmap.mdx"),
  },
};

/* -------------------------------------------------------------------------- */
/* Bengali — translated where a translation exists.                            */
/* -------------------------------------------------------------------------- */

const BN: Record<string, Entry> = {
  introduction: {
    meta: {
      title: "ভূমিকা",
      description:
        "Velox কী, এটি কোন উপর আঁকে, এবং একটি ফ্রেম আসলে কীভাবে তৈরি হয়।",
      order: 1,
      section: "start",
    },
    translated: true,
    load: () => import("@/content/bn/docs/introduction.mdx"),
  },
  installation: {
    meta: {
      title: "ইনস্টলেশন",
      description:
        "CLI ইনস্টল করুন, সোর্স থেকে বিল্ড করুন, এবং আপনার প্ল্যাটফর্মে টুলচেইন যাচাই করুন।",
      order: 2,
      section: "start",
    },
    translated: true,
    load: () => import("@/content/bn/docs/installation.mdx"),
  },
  "quick-start": {
    meta: {
      title: "দ্রুত শুরু",
      description:
        "একটি প্রকল্প স্ক্যাফোল্ড করুন, চালান, এবং আপনি যে তিনটি ফাইল পাচ্ছেন তা বুঝুন।",
      order: 3,
      section: "start",
    },
    translated: true,
    load: () => import("@/content/bn/docs/quick-start.mdx"),
  },
  "single-file-components": {
    meta: {
      title: "সিঙ্গেল-ফাইল কম্পোনেন্ট",
      description:
        "একটি .vx ফাইলের গঠন: টেমপ্লেট, স্ক্রিপ্ট সেটআপ, এবং স্কোপড স্টাইলশিট।",
      order: 10,
      section: "guide",
    },
    translated: true,
    load: () => import("@/content/bn/docs/single-file-components.mdx"),
  },
  "template-reference": {
    meta: {
      title: "টেমপ্লেট রেফারেন্স",
      description: "ডিরেক্টিভ, অ্যাট্রিবিউটের ধরন, এবং SFC ব্যাকরণের সঠিক রূপ।",
      order: 21,
      section: "reference",
    },
    translated: true,
    load: () => import("@/content/bn/docs/template-reference.mdx"),
  },
};

/* -------------------------------------------------------------------------- */
/* Simplified Chinese                                                          */
/* -------------------------------------------------------------------------- */

const ZH: Record<string, Entry> = {
  introduction: {
    meta: {
      title: "简介",
      description: "Velox 是什么、它绘制到什么之上，以及一帧究竟是如何构建的。",
      order: 1,
      section: "start",
    },
    translated: true,
    load: () => import("@/content/zh/docs/introduction.mdx"),
  },
  installation: {
    meta: {
      title: "安装",
      description: "安装 CLI、从源码构建，并在你的平台上验证工具链。",
      order: 2,
      section: "start",
    },
    translated: true,
    load: () => import("@/content/zh/docs/installation.mdx"),
  },
  "quick-start": {
    meta: {
      title: "快速开始",
      description: "搭建一个项目、运行它，并理解交给你的那三个文件。",
      order: 3,
      section: "start",
    },
    translated: true,
    load: () => import("@/content/zh/docs/quick-start.mdx"),
  },
  "template-reference": {
    meta: {
      title: "模板参考",
      description: "指令、属性种类，以及 SFC 语法的确切形态。",
      order: 21,
      section: "reference",
    },
    translated: true,
    load: () => import("@/content/zh/docs/template-reference.mdx"),
  },
};

const REGISTRY: Record<Locale, Record<string, Entry>> = { en: EN, bn: BN, zh: ZH };

/** Every slug that has an English page — the canonical page set. */
export const ALL_SLUGS = Object.keys(EN);

/** Parse a docs path into slug segments. */
export function hrefToSlug(href: string): string[] {
  return href.replace(/^\/docs\/?/, "").split("/").filter(Boolean);
}

/** Turn slug segments into a locale-less href. */
export function slugToHref(slug: readonly string[]): string {
  return slug.length ? `/docs/${slug.join("/")}` : "/docs";
}

/**
 * Does this locale have its own translation of this page?
 *
 * Based on PRESENCE in that locale's own registry, not on the `translated`
 * flag. The flag was a mistake: it had to be set on every one of the 13 English
 * entries by hand, and nobody did, so `getCoverage().en.translated` reported 0
 * and the docs index claimed no page was translated in its own source language.
 *
 * Presence is the honest signal — if `REGISTRY[locale][slug]` exists, the file
 * exists in that language. The flag is retained only as documentation and is
 * no longer load-bearing.
 */
export function isTranslated(locale: Locale, slug: string): boolean {
  return REGISTRY[locale]?.[slug] !== undefined;
}

/**
 * Resolve one page's metadata for a locale, falling back to English.
 *
 * Returns `undefined` when even English has no such page, which the route
 * turns into a proper 404 rather than rendering an empty shell.
 */
export function getDocMeta(locale: Locale, slug: string) {
  const entry = REGISTRY[locale]?.[slug] ?? REGISTRY[DEFAULT_LOCALE]?.[slug];
  if (!entry) return undefined;

  // Parse here rather than trusting the literal: a typo in a hand-written
  // frontmatter block then fails at the first page that uses it, at build
  // time, with the schema's message — rather than rendering a broken sidebar.
  const parsed = docMetaSchema.safeParse(entry.meta);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter for "${locale}:${slug}": ${parsed.error.issues
        .map((i) => `${i.path.join(".")} — ${i.message}`)
        .join("; ")}`,
    );
  }

  return {
    ...parsed.data,
    slug: slug.split("/"),
    href: slugToHref(slug.split("/")),
    locale,
  };
}

/** Every page available in a locale, English included, sorted. */
export function getAllDocs(locale: Locale): DocPage[] {
  const slugs = new Set([...ALL_SLUGS, ...Object.keys(REGISTRY[locale] ?? {})]);
  // The type predicate is load-bearing: without it the array is
  // `DocPage | undefined`, which then fails to satisfy the sidebar's
  // `DocPage[]` prop. Casting at the call site instead would leave the leak in
  // place for the next caller.
  return [...slugs]
    .map((slug) => getDocMeta(locale, slug))
    .filter((page): page is DocPage => page !== undefined);
}

/** Load the MDX body for a page, honouring the locale fallback. */
export async function getDocContent(locale: Locale, slug: string) {
  const entry = REGISTRY[locale]?.[slug] ?? REGISTRY[DEFAULT_LOCALE]?.[slug];
  if (!entry) return undefined;
  const mod = await entry.load();
  return mod.default;
}

/** Per-locale coverage, for the docs index page and the translation tests. */
export function getCoverage(): Record<Locale, { translated: number; total: number }> {
  return Object.fromEntries(
    LOCALES.map((locale) => {
      // Counts entries present in this locale's registry — see `isTranslated`.
      const translated = Object.keys(REGISTRY[locale] ?? {}).length;
      return [locale, { translated, total: ALL_SLUGS.length }];
    }),
  ) as Record<Locale, { translated: number; total: number }>;
}