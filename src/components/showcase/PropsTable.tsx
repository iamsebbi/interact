import type { ComponentPropDoc } from "@/registry";

export interface PropsTableProps {
  props: readonly ComponentPropDoc[];
}

export function PropsTable({ props }: PropsTableProps) {
  if (props.length === 0) return null;

  return (
    <div className="surface-stage overflow-x-auto rounded-2xl">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle text-xs font-medium text-muted-foreground">
            <th className="py-3 pr-3 pl-4 font-medium">Name</th>
            <th className="px-3 py-3 font-medium">Type</th>
            <th className="px-3 py-3 font-medium">Default</th>
            <th className="py-3 pr-4 pl-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {props.map((item) => (
            <tr key={item.name} className="align-middle">
              <td className="py-3 pr-3 pl-4 whitespace-nowrap">
                <code className="inline-flex items-center rounded-md bg-control px-2 py-0.5 font-mono text-xs text-foreground ring-1 ring-border-subtle">
                  {item.name}
                  {item.required && (
                    <>
                      <span
                        className="ml-1 text-destructive"
                        aria-hidden="true"
                      >
                        *
                      </span>
                      <span className="sr-only"> (required)</span>
                    </>
                  )}
                </code>
              </td>
              <td className="min-w-[110px] max-w-[260px] px-3 py-3 font-mono text-xs break-words text-muted-foreground">
                {item.type}
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <code className="inline-flex rounded-md bg-control/70 px-2 py-0.5 font-mono text-xs text-foreground ring-1 ring-border-subtle">
                  {item.defaultValue ?? "—"}
                </code>
              </td>
              <td className="min-w-[220px] py-3 pr-4 pl-3 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
