import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { MultiSelectPanel, MultiSelectTrigger } from "./fragments";
import { useMultiSelectPosition } from "./hooks";

export type OptionValue = string | number;

export type MultiSelectOption<V extends OptionValue> = {
  value: V;
  label: string;
};

export type MultiSelectProps<V extends OptionValue> = {
  id?: string;
  options: MultiSelectOption<V>[];
  values: V[];
  onChange: (next: V[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  invalid?: boolean;
  className?: string;
};

export function MultiSelect<V extends OptionValue>({
  id,
  options,
  values,
  onChange,
  placeholder = "Selecione",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum resultado.",
  invalid,
  className,
}: MultiSelectProps<V>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const position = useMultiSelectPosition(triggerRef, isOpen);

  const selectedOptions = useMemo(
    () =>
      values
        .map((value) => options.find((option) => option.value === value))
        .filter(Boolean) as MultiSelectOption<V>[],
    [values, options],
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const handleTriggerToggle = useCallback(() => {
    if (isOpen) {
      closePanel();
    } else {
      setIsOpen(true);
    }
  }, [isOpen, closePanel]);

  const handleToggleValue = useCallback(
    (value: V) => {
      if (values.includes(value)) {
        onChange(values.filter((current) => current !== value));
      } else {
        onChange([...values, value]);
      }
    },
    [values, onChange],
  );

  const handleRemoveValue = useCallback(
    (value: V) => {
      onChange(values.filter((current) => current !== value));
    },
    [values, onChange],
  );

  const handleSearchEnter = useCallback(() => {
    const firstOption = filteredOptions[0];
    if (firstOption) handleToggleValue(firstOption.value);
  }, [filteredOptions, handleToggleValue]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closePanel();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePanel();
      triggerRef.current?.focus();
    };
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closePanel]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <MultiSelectTrigger
        ref={triggerRef}
        id={id}
        open={isOpen}
        invalid={invalid}
        placeholder={placeholder}
        selectedOptions={selectedOptions}
        listboxId={listboxId}
        onToggle={handleTriggerToggle}
        onRemove={handleRemoveValue}
      />
      {isOpen && position ? (
        <MultiSelectPanel
          panelRef={panelRef}
          listboxId={listboxId}
          position={position}
          query={query}
          onQueryChange={setQuery}
          onSearchEnter={handleSearchEnter}
          options={filteredOptions}
          values={values}
          onToggle={handleToggleValue}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
        />
      ) : null}
    </div>
  );
}
