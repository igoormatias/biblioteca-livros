import { useEffect, useId, useRef, type ReactNode } from "react";
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
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        "fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm",
        "animate-modal-overlay",
      )}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "w-full max-w-lg overflow-hidden rounded-lg border border-border/70 bg-surface shadow-card outline-none",
          "animate-modal-dialog",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
          <h3 id={titleId} className="text-[15px] font-semibold tracking-tight text-text">
            {title}
          </h3>
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
        <div className="px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border/50 px-6 py-3">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
