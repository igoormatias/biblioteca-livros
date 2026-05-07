import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "default" | "edit" | "delete";

export type RowActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function RowActionButton({
  variant = "default",
  className,
  type = "button",
  ...props
}: RowActionButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "hover:bg-bg hover:text-text",
        variant === "edit" && "hover:bg-tertiary/10 hover:text-tertiary",
        variant === "delete" && "hover:bg-danger/10 hover:text-danger",
        className,
      )}
    />
  );
}
