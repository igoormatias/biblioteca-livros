import { forwardRef, type ForwardedRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "../../../../lib/cn";
import type { MultiSelectOption, OptionValue } from "../../MultiSelect";

export type MultiSelectTriggerProps<V extends OptionValue> = {
  id?: string;
  open: boolean;
  invalid?: boolean;
  placeholder: string;
  selectedOptions: MultiSelectOption<V>[];
  listboxId: string;
  onToggle: () => void;
  onRemove: (value: V) => void;
};

function MultiSelectTriggerInner<V extends OptionValue>(
  {
    id,
    open,
    invalid,
    placeholder,
    selectedOptions,
    listboxId,
    onToggle,
    onRemove,
  }: MultiSelectTriggerProps<V>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      type="button"
      id={id}
      role="combobox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-haspopup="listbox"
      onClick={onToggle}
      className={cn(
        "flex min-h-10 w-full cursor-pointer flex-wrap items-center gap-1 rounded-md border bg-surface px-2.5 py-1.5 text-left text-sm transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        invalid
          ? "border-danger/40 hover:border-danger/60 focus-visible:border-danger/60 focus-visible:ring-danger/25"
          : "border-border/70 hover:border-border focus-visible:border-primary/40",
        open && !invalid && "border-primary/40 ring-2 ring-primary/25",
      )}
    >
      {selectedOptions.length === 0 ? (
        <span className="px-1 text-muted">{placeholder}</span>
      ) : (
        selectedOptions.map((option) => (
          <span
            key={String(option.value)}
            className="inline-flex h-6 items-center gap-1 rounded-md bg-primary/8 pl-2 pr-1 text-[11.5px] font-medium leading-none text-primary"
          >
            {option.label}
            <span
              role="button"
              tabIndex={-1}
              aria-label={`Remover ${option.label}`}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(option.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(option.value);
                }
              }}
              className="inline-flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-sm text-primary/80 transition-colors duration-200 hover:bg-primary/15 hover:text-primary"
            >
              <X className="h-3 w-3" aria-hidden />
            </span>
          </span>
        ))
      )}
      <ChevronDown
        aria-hidden
        className={cn(
          "ml-auto h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

export const MultiSelectTrigger = forwardRef(MultiSelectTriggerInner) as <V extends OptionValue>(
  props: MultiSelectTriggerProps<V> & { ref?: ForwardedRef<HTMLButtonElement> },
) => ReturnType<typeof MultiSelectTriggerInner>;
