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
        "whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ className, children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...props} className={cn("px-4 py-3 text-text", className)}>
      {children}
    </td>
  );
}

export function TableEmpty({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border/70 bg-bg/40 px-6 py-10 text-center text-sm text-muted">
      {children ?? "Sem dados."}
    </div>
  );
}

