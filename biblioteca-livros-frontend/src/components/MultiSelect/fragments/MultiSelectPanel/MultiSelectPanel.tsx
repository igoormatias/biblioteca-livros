import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Check, Search } from "lucide-react";
import { cn } from "../../../../lib/cn";
import type { MultiSelectOption, OptionValue } from "../../MultiSelect";
import type { PanelPosition } from "../../hooks/useMultiSelectPosition";

export type MultiSelectPanelProps<V extends OptionValue> = {
  panelRef: RefObject<HTMLDivElement | null>;
  listboxId: string;
  position: PanelPosition;
  query: string;
  onQueryChange: (query: string) => void;
  onSearchEnter: () => void;
  options: MultiSelectOption<V>[];
  values: V[];
  onToggle: (value: V) => void;
  searchPlaceholder: string;
  emptyText: string;
};

export function MultiSelectPanel<V extends OptionValue>({
  panelRef,
  listboxId,
  position,
  query,
  onQueryChange,
  onSearchEnter,
  options,
  values,
  onToggle,
  searchPlaceholder,
  emptyText,
}: MultiSelectPanelProps<V>) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, []);

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onSearchEnter();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
      }}
      className={cn(
        "z-60 flex flex-col overflow-hidden rounded-md border border-border/70 bg-surface shadow-card",
        position.placement === "bottom" ? "animate-popover-down" : "animate-popover-up",
      )}
    >
      <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border/60 bg-surface/95 px-3 py-2.5 backdrop-blur-sm">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
        </div>
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="flex-1 px-1 py-1"
        >
          {options.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted">{emptyText}</li>
          ) : (
            options.map((option) => {
              const isSelected = values.includes(option.value);
              return (
                <li
                  key={String(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onToggle(option.value)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2.5 py-1.5 text-sm transition-colors duration-150 ease-out hover:bg-bg",
                    isSelected ? "bg-primary/6 font-medium text-text" : "text-text",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden /> : null}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
