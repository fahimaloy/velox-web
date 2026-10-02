/**
 * Test stub for `next-intl/server`.
 *
 * The real module reads the active locale from React's server-request context,
 * which only exists inside a Next render. Tests import the docs registry, which
 * does not need it, so these are no-ops that keep the import graph resolvable.
 * If a test ever needs real i18n behaviour, it should render a component
 * instead of relying on this.
 */
export async function setRequestLocale(_locale: string): Promise<void> {}
export async function getMessages(): Promise<Record<string, unknown>> {
  return {};
}
export async function getTranslations(): Promise<((key: string) => string) & {
  raw: <T>(key: string) => T;
}> {
  const fn = ((key: string) => key) as ((key: string) => string) & {
    raw: <T>(key: string) => T;
  };
  fn.raw = <T,>(key: string) => key as unknown as T;
  return fn as never;
}
export async function getLocale(): Promise<string> {
  return "en";
}
