import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../../lib/cn";

export type BackToTopButtonProps = {
  threshold?: number;
  className?: string;
};

const getScrollY = (): number => {
  if (typeof window === "undefined") return 0;
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  return scrollY;
}

const scrollToTop = (behavior: ScrollBehavior) => {
  window.scrollTo({ top: 0, left: 0, behavior });
  if (typeof document !== "undefined") {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

export function BackToTopButton({ threshold = 200, className }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(() => getScrollY() > threshold);

  useEffect(() => {
    const onScroll = () => setVisible(getScrollY() > threshold);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });    
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [threshold]);

  const handleClick = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scrollToTop(prefersReducedMotion ? "auto" : "smooth");
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Voltar ao topo"
      className={cn(
        "fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-card transition",
        "hover:brightness-95 active:brightness-90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "cursor-pointer",
        className,
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
