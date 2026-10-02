"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button.
 *
 * Variants are declared with `cva` so the shape of every button in the system
 * is one readable table rather than a className string copied around.
 *
 * `asChild` lets a `<Button>` render as a `<Link>` (a navigation target is
 * still a button visually and for screen readers) without duplicating styling.
 * Note the site-wide rule: `Button` is never a raw `<a>`; links that navigate
 * within the app use `Button` with `asChild` around next-intl's `Link`.
 */
const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-[background-color,color,border-color,transform] duration-150",
    "disabled:pointer-events-none disabled:opacity-45",
    // A press that moves 1px reads as mechanical, which suits an instrument.
    "active:translate-y-px",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-canvas hover:bg-accent-hover font-semibold",
        secondary:
          "border border-line-strong bg-panel text-ink hover:bg-sunken",
        ghost: "text-muted hover:bg-panel hover:text-ink",
        outline:
          "border border-line bg-transparent text-ink hover:border-accent hover:text-accent-ink",
        link: "text-accent-ink underline underline-offset-4 p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-[0.8125rem] rounded-[4px]",
        md: "h-10 px-4 text-sm rounded-[6px]",
        lg: "h-12 px-6 text-[0.9375rem] rounded-[6px]",
        icon: "size-9 rounded-[6px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        // A <button> inside a <form> defaults to type="submit"; an unlabelled
        // default is a common source of accidental submissions, so default it.
        {...(asChild ? {} : { type: type ?? "button" })}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };