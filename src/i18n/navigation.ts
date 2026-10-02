import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware wrappers around the Next.js navigation APIs.
 *
 * Always import `Link`, `redirect`, `useRouter` and `usePathname` from HERE,
 * never from `next/link` / `next/navigation`. These wrappers prepend the
 * active locale segment automatically; the raw APIs do not, which is the
 * single most common way a next-intl app ends up with unprefixed links that
 * silently fall back to English.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);