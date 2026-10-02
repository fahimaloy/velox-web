import { useTranslations } from "next-intl";
import { DIRECTIVES } from "@/lib/velox-facts";

/**
 * The directive implementation table.
 *
 * The "implemented" column is the reason this is a component: it is the single
 * most consequential fact in the documentation, and it is exactly the thing a
 * hand-maintained markdown table would eventually get wrong. Rendered straight
 * from the data, it cannot.
 */
export function DirectiveTable() {
  const t = useTranslations("directiveTable");

  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse">
        <thead>
          <tr className="border-b border-line-strong">
            <th scope="col" className="p-2.5 text-start font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
              {t("directive")}
            </th>
            <th scope="col" className="p-2.5 text-start font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
              {t("implemented")}
            </th>
            <th scope="col" className="p-2.5 text-start font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
              {t("notes")}
            </th>
          </tr>
        </thead>
        <tbody>
          {DIRECTIVES.map((row) => (
            <tr key={row.name} className="border-b border-line">
              <th scope="row" className="p-2.5 text-start">
                <code className="font-mono text-sm text-ink" lang="en">{row.name}</code>
              </th>
              <td className="p-2.5">
                {row.implemented ? (
                  <span className="font-mono text-xs text-ok">{t("yes")}</span>
                ) : (
                  <span className="font-mono text-xs text-accent">{t("no")}</span>
                )}
              </td>
              <td className="p-2.5 text-sm text-muted">
                {t(`notes.${row.id}`, { default: row.note })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
