import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../Button";

export function Modal({
  title,
  open,
  onClose,
  children,
  footer,
  className,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div
        className={cn(
          "w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface shadow-card",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold text-primary">{title}</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar"
            title="Fechar"
            className="h-9 w-9 px-0"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

