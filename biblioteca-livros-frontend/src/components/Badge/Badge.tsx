import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "default" | "primary";
type Tone = "filled" | "outline";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  tone?: Tone;
};

export function Badge({
  variant = "default",
  tone = "filled",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em]",
        variant === "default" && tone === "filled" && "bg-bg text-muted",
        variant === "default" && tone === "outline" && "border border-border/70 text-muted",
        variant === "primary" && tone === "filled" && "bg-primary/10 text-primary",
        variant === "primary" && tone === "outline" && "border border-primary/30 text-primary",
        className,
      )}
    />
  );
}
