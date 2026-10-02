"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Theme toggle: light → dark → system, cycling.
 *
 * Two details that matter more than they look:
 *
 * 1. The mounted guard. `next-themes` cannot know the resolved theme during
 *    SSR — the user's preference lives in localStorage, which the server has
 *    never seen. Rendering the resolved icon immediately produces a hydration
 *    mismatch (server says "moon", client says "sun"). So the component
 *    renders a fixed-size placeholder until mounted, then swaps in the real
 *    icon. The placeholder reserves the exact dimensions, so nothing shifts.
 *
 * 2. It is a `<button>` with an accessible name, not three separate buttons.
 *    A single cycling control is the conventional pattern (Vercel, MDN, the
 *    Tailwind docs all do it) and it keeps the header from growing a row of
 *    icons as themes are added.
 */
/**
 * A no-op subscription.
 *
 * The value this component needs is "has the client hydrated yet", which never
 * changes after hydration — so there is nothing to subscribe to. The store is
 * a constant, and this empty subscribe simply never fires.
 */
const subscribeToNothing = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  /**
   * Hydration-safe "have we mounted yet", WITHOUT a setState-in-effect.
   *
   * `useSyncExternalStore` with a server snapshot of `false` is the correct
   * primitive here: on the server it returns the snapshot, on the client it
   * subscribes. The first client render therefore matches the server HTML
   * exactly (no hydration mismatch), and after hydration it returns the real
   * client snapshot. No effect, no cascading render, no `setState`.
   */
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const next =
    theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = !mounted
    ? Sun
    : theme === "dark"
      ? Moon
      : theme === "light"
        ? Sun
        : Monitor;

  const label = !mounted
    ? t("toggle")
    : `${t("toggle")} — ${t(next)}`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center text-muted",
        "transition-colors hover:bg-panel hover:text-ink",
        className,
      )}
    >
      <Icon className="size-[1.05rem]" aria-hidden />
    </button>
  );
}