/**
 * The fixed background: the etched grid and the two atmospheric washes.
 *
 * Rendered as a sibling of the page content rather than as a `background` on
 * <body>, because it needs `position: fixed` to stay put while the document
 * scrolls — a scrolling grid makes the whole page feel unstable. `pointer-events:
 * none` ensures it never intercepts a click, and `z-index: -1` puts it behind
 * everything without needing `isolation` on an ancestor.
 */
export function Atmosphere() {
  return (
    <>
      <div aria-hidden className="atmosphere" />
      <div aria-hidden className="rule-grid pointer-events-none fixed inset-0 -z-10" />
    </>
  );
}