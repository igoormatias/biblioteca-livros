import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition",
        "cursor-pointer disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:opacity-60 disabled:pointer-events-none",
        size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:brightness-95 active:brightness-90",
        variant === "secondary" &&
          "bg-surface text-text border border-border hover:bg-bg active:bg-bg/70",
        variant === "danger" &&
          "bg-danger text-white hover:brightness-95 active:brightness-90",
        variant === "ghost" && "bg-transparent text-text hover:bg-bg active:bg-bg/70",
        className,
      )}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {children}
    </button>
  );
}

