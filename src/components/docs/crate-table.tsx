import { CRATES } from "@/lib/velox-facts";
import { getLocaleOption } from "@/lib/locale-meta";
import type { Locale } from "@/i18n/locale";

/**
 * The crate table, read from `velox-facts.ts`.
 *
 * This exists as a component rather than as markdown so the line counts and
 * roles cannot drift away from the single file that records them. If the
 * measured numbers change, this table changes with them — there is no second
 * copy to forget to update.
 */
export function CrateTable({ locale }: { locale: Locale }) {
  const option = getLocaleOption(locale);
  const max = Math.max(...CRATES.map((c) => c.loc));

  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full min-w-[38rem] border-collapse">
        <thead>
          <tr className="border-b border-line-strong">
            <th scope="col" className="p-2.5 text-start font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">Crate</th>
            <th scope="col" className="p-2.5 text-start font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">Role</th>
            <th scope="col" className="p-2.5 text-end font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">Lines</th>
          </tr>
        </thead>
        <tbody>
          {CRATES.map((crate) => (
            <tr key={crate.name} className="border-b border-line">
              <th scope="row" className="p-2.5 text-start">
                <code className="font-mono text-sm text-accent-ink" lang="en">{crate.name}</code>
              </th>
              <td className="p-2.5 text-sm text-muted">{crate.role}</td>
              <td className="p-2.5 text-end">
                <span className="flex items-center justify-end gap-3">
                  <span aria-hidden className="hidden h-1 w-16 bg-sunken sm:block">
                    <span className="block h-full bg-accent" style={{ width: `${(crate.loc / max) * 100}%` }} />
                  </span>
                  <span className="font-mono text-sm tabular text-muted">
                    {crate.loc.toLocaleString(option.tag)}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
