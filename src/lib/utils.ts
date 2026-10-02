import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, letting later classes win over earlier ones for
 * the same property group.
 *
 * This is the standard shadcn/ui helper. It exists because a component that
 * accepts `className` cannot know which classes the caller passed; without the
 * merge step, `px-6` from the component would beat `px-2` from the caller
 * depending on stylesheet order rather than on intent.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}