/**
 * The Velox wordmark.
 *
 * A square mark plus the name in the display face. The mark is a stylised
 * raster scanline block: three horizontal bars of decreasing length inside a
 * bordered square, which is what a frame of scanlines actually looks like. It
 * is drawn in the current text colour and the accent, so it themes itself with
 * zero extra CSS and no image request.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="flex items-center gap-2.5">
        <svg
          viewBox="0 0 24 24"
          className="size-6 shrink-0"
          aria-hidden
          fill="none"
        >
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="23"
            stroke="currentColor"
            strokeOpacity="0.25"
          />
          <rect x="4" y="5" width="16" height="2.5" className="fill-accent" />
          <rect x="4" y="10.75" width="11" height="2.5" className="fill-current" />
          <rect x="4" y="16.5" width="6" height="2.5" className="fill-current" fillOpacity="0.45" />
        </svg>
        <span className="font-display text-[1.3rem] font-semibold leading-none tracking-[-0.03em]">
          Velox
        </span>
      </span>
    </span>
  );
}