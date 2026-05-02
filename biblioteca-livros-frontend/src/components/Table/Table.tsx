import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table {...props} className={cn("w-full text-sm", className)} />;
}

export function Th({ className, children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ className, children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...props} className={cn("px-3 py-2 text-text", className)}>
      {children}
    </td>
  );
}

export function TableEmpty({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-bg p-6 text-center text-sm text-muted">
      {children ?? "Sem dados."}
    </div>
  );
}

